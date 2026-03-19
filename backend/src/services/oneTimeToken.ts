import { randomBytes, randomUUID } from "node:crypto";

function parseExpiresToMs(input: string) {
  const m = String(input).trim().match(/^(\d+)([smhd])$/i);
  if (!m) return 15 * 60 * 1000;
  const n = Number(m[1]);
  const u = m[2].toLowerCase();
  if (u === "s") return n * 1000;
  if (u === "m") return n * 60 * 1000;
  if (u === "h") return n * 60 * 60 * 1000;
  return n * 24 * 60 * 60 * 1000;
}

export function createOneTimeToken(expiresIn: string) {
  const jti = randomUUID();
  const secret = randomBytes(32).toString("hex");
  const token = `${jti}.${secret}`;
  const expiresAt = new Date(Date.now() + parseExpiresToMs(expiresIn)).toISOString();
  return { token, jti, expiresAt };
}

export function extractJti(token: string) {
  const idx = token.indexOf(".");
  if (idx <= 0) return null;
  return token.slice(0, idx);
}
