import type { FastifyReply, FastifyRequest } from "fastify";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function createRateLimit(input: {
  max: number;
  windowMs: number;
  keyPrefix: string;
}) {
  return async function rateLimit(req: FastifyRequest, reply: FastifyReply) {
    const ip = String(req.ip || req.headers["x-forwarded-for"] || "unknown");
    const key = `${input.keyPrefix}:${ip}`;
    const now = Date.now();
    const current = buckets.get(key);
    if (!current || now >= current.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + input.windowMs });
      return;
    }
    current.count += 1;
    buckets.set(key, current);
    if (current.count > input.max) {
      const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      reply.header("Retry-After", String(retryAfter));
      return reply.status(429).send({ ok: false, error: "rate_limited", retryAfter });
    }
  };
}
