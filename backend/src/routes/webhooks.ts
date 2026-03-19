import type { FastifyInstance } from "fastify";
import { createHmac } from "node:crypto";
import { z } from "zod";
import { acquireIdempotency, upsertPayment } from "../db";
import { PAYSTACK_SECRET_KEY } from "../config";
import { toIdHex } from "../vault";
import { enqueueDepositEscrow } from "../queue";

const paystackSchema = z.object({
  event: z.string(),
  data: z.object({
    id: z.union([z.number(), z.string()]).optional(),
    reference: z.string(),
    amount: z.number().optional(),
    currency: z.string().optional(),
    status: z.string().optional(),
    metadata: z
      .object({
        tripId: z.string().optional(),
        trip_id: z.string().optional(),
        riderAddress: z.string().optional(),
        customerAddress: z.string().optional(),
        amountCngnWei: z.union([z.string(), z.number()]).optional()
      })
      .passthrough()
      .optional()
  })
});

export function registerWebhookRoutes(app: FastifyInstance, vault: any) {
  app.post("/api/webhooks/paystack", async (req, reply) => {
    const raw = (req as any).rawBody as string | undefined;
    const sig = String(req.headers["x-paystack-signature"] || "");
    if (!PAYSTACK_SECRET_KEY || !raw || !sig) {
      return reply.status(400).send({ ok: false, error: "missing_signature" });
    }
    const expected = createHmac("sha512", PAYSTACK_SECRET_KEY).update(raw).digest("hex");
    if (expected !== sig) {
      return reply.status(401).send({ ok: false, error: "invalid_signature" });
    }
    const payload = paystackSchema.parse(req.body);
    const eventId = String(payload.data.id ?? payload.data.reference);
    const idemKey = `${payload.event}:${eventId}`;
    const firstTime = await acquireIdempotency("paystack_webhook", idemKey);
    if (!firstTime) {
      return reply.send({ ok: true, duplicate: true });
    }
    const tripId = payload.data.metadata?.tripId || payload.data.metadata?.trip_id || null;
    const amountKobo = payload.data.amount ?? 0;
    await upsertPayment({
      provider: "paystack",
      reference: payload.data.reference,
      event: payload.event,
      amountKobo,
      currency: payload.data.currency || "NGN",
      status: payload.data.status || "unknown",
      tripId,
      payload
    });
    if (payload.event === "charge.success" && vault && tripId) {
      const rider = payload.data.metadata?.riderAddress;
      const customer = payload.data.metadata?.customerAddress;
      if (rider && customer) {
        const idHex = toIdHex(tripId);
        const amountCngnWei =
          payload.data.metadata?.amountCngnWei != null
            ? BigInt(String(payload.data.metadata.amountCngnWei))
            : BigInt(amountKobo) * BigInt("10000000000000000");
        try {
          await enqueueDepositEscrow({
            tripId,
            tripIdHex: idHex,
            customer,
            rider,
            amountCngnWei: amountCngnWei.toString()
          });
        } catch {}
      }
    }
    return reply.send({ ok: true });
  });
}
