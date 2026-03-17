import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { toIdHex } from "../vault";
import { getState, setFrozen } from "../services/progress";

export function registerTripRoutes(app: FastifyInstance, vault: any) {
  const settleSchema = z.object({ deliveryProof: z.string().min(1) });
  const vectorSchema = z.object({ vector: z.number() });

  app.post("/api/trips/:id/settle", async (req, reply) => {
    const p = settleSchema.parse(req.body);
    const id = String((req.params as any).id);
    if (!vault) return reply.status(500).send({ ok: false, error: "vault_not_configured" });
    const idHex = toIdHex(id);
    try {
      await vault.settle(idHex);
      return reply.send({ ok: true });
    } catch {
      return reply.status(500).send({ ok: false });
    }
  });

  app.post("/api/trips/:id/freeze", async (req, reply) => {
    const b = vectorSchema.parse(req.body);
    const id = String((req.params as any).id);
    if (!vault) return reply.status(500).send({ ok: false, error: "vault_not_configured" });
    const idHex = toIdHex(id);
    const s = getState(id);
    s.frozen = true;
    setFrozen(id, true);
    try {
      await vault.reportDeviation(idHex, BigInt(Math.floor(b.vector)));
      return reply.send({ ok: true });
    } catch {
      return reply.status(500).send({ ok: false });
    }
  });

  app.post("/api/trips/:id/unfreeze", async (req, reply) => {
    const id = String((req.params as any).id);
    if (!vault) return reply.status(500).send({ ok: false, error: "vault_not_configured" });
    const idHex = toIdHex(id);
    setFrozen(id, false);
    try {
      await vault.reportReentry(idHex);
      return reply.send({ ok: true });
    } catch {
      return reply.status(500).send({ ok: false });
    }
  });
}
