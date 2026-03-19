import type { FastifyInstance } from "fastify";
import { z } from "zod";
import argon2 from "argon2";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getRefreshTokenByJti,
  revokeRefreshToken,
  saveRefreshToken,
  type UserRole
} from "../db";
import { requireAccessToken, requireRole } from "../auth";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../services/tokens";
import { createRateLimit } from "../services/rateLimit";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(120).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20)
});

const logoutSchema = z.object({
  refreshToken: z.string().min(20)
});

async function registerWithRole(body: z.infer<typeof registerSchema>, role: UserRole) {
  const existing = await findUserByEmail(body.email);
  if (existing) return { error: "email_already_exists" as const };
  const passwordHash = await argon2.hash(body.password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1
  });
  const user = await createUser({
    email: body.email,
    passwordHash,
    role,
    fullName: body.fullName || null
  });
  const accessToken = signAccessToken(user.id, user.role);
  const refresh = signRefreshToken(user.id, user.role);
  const refreshHash = await argon2.hash(refresh.token, {
    type: argon2.argon2id,
    memoryCost: 12288,
    timeCost: 2,
    parallelism: 1
  });
  await saveRefreshToken({
    userId: user.id,
    jti: refresh.jti,
    tokenHash: refreshHash,
    expiresAtIso: refresh.expiresAt
  });
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name
    },
    accessToken,
    refreshToken: refresh.token
  };
}

export function registerAuthRoutes(app: FastifyInstance) {
  const authRateLimit = createRateLimit({
    keyPrefix: "auth",
    max: 20,
    windowMs: 60_000
  });

  app.post("/auth/register/customer", { preHandler: authRateLimit }, async (req, reply) => {
    const body = registerSchema.parse(req.body);
    const out = await registerWithRole(body, "customer");
    if ("error" in out) {
      return reply.status(409).send({ ok: false, error: out.error });
    }
    return reply.status(201).send({ ok: true, ...out });
  });

  app.post("/auth/register/logistics", { preHandler: authRateLimit }, async (req, reply) => {
    const body = registerSchema.parse(req.body);
    const out = await registerWithRole(body, "logistics");
    if ("error" in out) {
      return reply.status(409).send({ ok: false, error: out.error });
    }
    return reply.status(201).send({ ok: true, ...out });
  });

  app.post("/auth/login", { preHandler: authRateLimit }, async (req, reply) => {
    const body = loginSchema.parse(req.body);
    const user = await findUserByEmail(body.email);
    if (!user || !user.is_active) {
      return reply.status(401).send({ ok: false, error: "invalid_credentials" });
    }
    const ok = await argon2.verify(user.password_hash, body.password);
    if (!ok) {
      return reply.status(401).send({ ok: false, error: "invalid_credentials" });
    }
    const accessToken = signAccessToken(user.id, user.role);
    const refresh = signRefreshToken(user.id, user.role);
    const refreshHash = await argon2.hash(refresh.token, {
      type: argon2.argon2id,
      memoryCost: 12288,
      timeCost: 2,
      parallelism: 1
    });
    await saveRefreshToken({
      userId: user.id,
      jti: refresh.jti,
      tokenHash: refreshHash,
      expiresAtIso: refresh.expiresAt
    });
    return reply.send({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name
      },
      accessToken,
      refreshToken: refresh.token
    });
  });

  app.post("/auth/refresh", { preHandler: authRateLimit }, async (req, reply) => {
    const body = refreshSchema.parse(req.body);
    let payload: ReturnType<typeof verifyRefreshToken>;
    try {
      payload = verifyRefreshToken(body.refreshToken);
    } catch {
      return reply.status(401).send({ ok: false, error: "invalid_refresh_token" });
    }
    if (payload.typ !== "refresh") {
      return reply.status(401).send({ ok: false, error: "invalid_refresh_token_type" });
    }
    const row = await getRefreshTokenByJti(payload.jti);
    if (!row || row.revoked_at || Number(row.user_id) !== Number(payload.sub)) {
      return reply.status(401).send({ ok: false, error: "refresh_token_not_found" });
    }
    if (new Date(row.expires_at).getTime() <= Date.now()) {
      return reply.status(401).send({ ok: false, error: "refresh_token_expired" });
    }
    const match = await argon2.verify(row.token_hash, body.refreshToken);
    if (!match) {
      return reply.status(401).send({ ok: false, error: "invalid_refresh_token" });
    }
    const user = await findUserById(Number(payload.sub));
    if (!user || !user.is_active) {
      return reply.status(401).send({ ok: false, error: "invalid_user" });
    }
    await revokeRefreshToken(payload.jti);
    const accessToken = signAccessToken(user.id, user.role);
    const refresh = signRefreshToken(user.id, user.role);
    const refreshHash = await argon2.hash(refresh.token, {
      type: argon2.argon2id,
      memoryCost: 12288,
      timeCost: 2,
      parallelism: 1
    });
    await saveRefreshToken({
      userId: user.id,
      jti: refresh.jti,
      tokenHash: refreshHash,
      expiresAtIso: refresh.expiresAt
    });
    return reply.send({
      ok: true,
      accessToken,
      refreshToken: refresh.token
    });
  });

  app.post("/auth/logout", { preHandler: authRateLimit }, async (req, reply) => {
    const body = logoutSchema.parse(req.body);
    let payload: ReturnType<typeof verifyRefreshToken>;
    try {
      payload = verifyRefreshToken(body.refreshToken);
    } catch {
      return reply.send({ ok: true });
    }
    await revokeRefreshToken(payload.jti);
    return reply.send({ ok: true });
  });

  app.get("/auth/me", { preHandler: requireAccessToken }, async (req, reply) => {
    const userId = req.authUser?.userId;
    if (!userId) {
      return reply.status(401).send({ ok: false, error: "missing_auth_user" });
    }
    const user = await findUserById(userId);
    if (!user) {
      return reply.status(404).send({ ok: false, error: "user_not_found" });
    }
    return reply.send({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        isActive: user.is_active
      }
    });
  });

  app.get(
    "/auth/admin/users",
    { preHandler: [requireAccessToken, requireRole(["admin"])] },
    async (_req, reply) => {
      return reply.send({ ok: true, message: "admin_guard_ok" });
    }
  );
}
