import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET
} from "../config";
import type { UserRole } from "../db";

export type AccessPayload = {
  sub: string;
  role: UserRole;
  typ: "access";
};

export type RefreshPayload = {
  sub: string;
  role: UserRole;
  typ: "refresh";
  jti: string;
};

function mustSecret(secret: string, key: string) {
  if (!secret) throw new Error(`${key}_NOT_CONFIGURED`);
  return secret;
}

function parseExpiresToMs(input: string) {
  const m = String(input).trim().match(/^(\d+)([smhd])$/i);
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  if (u === "s") return n * 1000;
  if (u === "m") return n * 60 * 1000;
  if (u === "h") return n * 60 * 60 * 1000;
  return n * 24 * 60 * 60 * 1000;
}

export function signAccessToken(userId: number, role: UserRole) {
  const secret = mustSecret(JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET");
  const payload: AccessPayload = { sub: String(userId), role, typ: "access" };
  return jwt.sign(payload, secret, { expiresIn: JWT_ACCESS_EXPIRES_IN as any });
}

export function signRefreshToken(userId: number, role: UserRole) {
  const secret = mustSecret(JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET");
  const jti = randomUUID();
  const payload: RefreshPayload = { sub: String(userId), role, typ: "refresh", jti };
  const token = jwt.sign(payload, secret, { expiresIn: JWT_REFRESH_EXPIRES_IN as any });
  const expiresAt = new Date(Date.now() + parseExpiresToMs(JWT_REFRESH_EXPIRES_IN)).toISOString();
  return { token, jti, expiresAt };
}

export function verifyAccessToken(token: string) {
  const secret = mustSecret(JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET");
  return jwt.verify(token, secret) as AccessPayload & jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  const secret = mustSecret(JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET");
  return jwt.verify(token, secret) as RefreshPayload & jwt.JwtPayload;
}
