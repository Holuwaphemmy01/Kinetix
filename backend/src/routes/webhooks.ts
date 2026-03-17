import type { FastifyInstance } from "fastify";

export function registerWebhookRoutes(app: FastifyInstance) {
  app.post("/api/webhooks/paystack", async (_req, reply) => {
    return reply.send({ ok: true });
  });
}
