import type { FastifyReply, FastifyRequest } from "fastify";
import { timingSafeEqual } from "node:crypto";
import { ADMIN_API_KEY, SERVICE_API_KEY } from "./config";

function parseBearerToken(req: FastifyRequest) {
  const auth = String(req.headers.authorization || "");
  if (!auth.toLowerCase().startsWith("bearer ")) return "";
  return auth.slice(7).trim();
}

function safeEqual(a: string, b: string) {
  if (!a || !b) return false;
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return timingSafeEqual(aa, bb);
}

function getApiKey(req: FastifyRequest) {
  const bearer = parseBearerToken(req);
  const headerKey = String(req.headers["x-api-key"] || "");
  return bearer || headerKey;
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  if (!ADMIN_API_KEY) {
    return reply.status(500).send({ ok: false, error: "admin_key_not_configured" });
  }
  const key = getApiKey(req);
  if (!safeEqual(key, ADMIN_API_KEY)) {
    return reply.status(401).send({ ok: false, error: "unauthorized_admin" });
  }
}

export async function requireServiceOrAdmin(req: FastifyRequest, reply: FastifyReply) {
  const key = getApiKey(req);
  const serviceOk = SERVICE_API_KEY && safeEqual(key, SERVICE_API_KEY);
  const adminOk = ADMIN_API_KEY && safeEqual(key, ADMIN_API_KEY);
  if (!serviceOk && !adminOk) {
    return reply.status(401).send({ ok: false, error: "unauthorized_service" });
  }
}
