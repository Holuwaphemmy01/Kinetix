import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { toIdHex } from "../vault";
import { getState, setFrozen } from "../services/progress";
import { addTripEvent, getTripSnapshot, listTripEvents, listTripProgress, upsertTripCorridor } from "../db";
import { enqueueReportDeviation, enqueueReportReentry, enqueueSettle } from "../queue";

export function registerTripRoutes(app: FastifyInstance, vault: any) {
  const settleSchema = z.object({ deliveryProof: z.string().min(1) });
  const vectorSchema = z.object({ vector: z.number() });
  const corridorSchema = z.object({
    corridor: z
      .array(z.object({ lat: z.number(), lng: z.number() }))
      .min(2),
    bufferMeters: z.number().int().positive().max(1000).default(80)
  });

  app.post("/api/trips/:id/settle", async (req, reply) => {
    const p = settleSchema.parse(req.body);
    const id = String((req.params as any).id);
    if (!vault) return reply.status(500).send({ ok: false, error: "vault_not_configured" });
    const idHex = toIdHex(id);
    try {
      await enqueueSettle({ tripId: id, tripIdHex: idHex });
      await addTripEvent(id, "settle_requested", { deliveryProof: p.deliveryProof });
      return reply.send({ ok: true, queued: true });
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
      await enqueueReportDeviation({ tripId: id, tripIdHex: idHex, vectorScaled: Math.floor(b.vector) });
      await addTripEvent(id, "freeze_requested", { vector: b.vector });
      return reply.send({ ok: true, queued: true });
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
      await enqueueReportReentry({ tripId: id, tripIdHex: idHex });
      await addTripEvent(id, "unfreeze_requested", {});
      return reply.send({ ok: true, queued: true });
    } catch {
      return reply.status(500).send({ ok: false });
    }
  });

  app.post("/api/trips/:id/corridor", async (req, reply) => {
    const id = String((req.params as any).id);
    const body = corridorSchema.parse(req.body);
    await upsertTripCorridor({
      tripId: id,
      corridor: body.corridor,
      bufferMeters: body.bufferMeters
    });
    await addTripEvent(id, "corridor_updated", {
      points: body.corridor.length,
      bufferMeters: body.bufferMeters
    });
    return reply.send({ ok: true });
  });

  app.get("/api/trips/:id/events", async (req, reply) => {
    const id = String((req.params as any).id);
    const limitRaw = Number((req.query as any)?.limit ?? 50);
    const limit = Number.isFinite(limitRaw) ? limitRaw : 50;
    const items = await listTripEvents(id, limit);
    return reply.send({ ok: true, tripId: id, count: items.length, items });
  });

  app.get("/api/trips/:id", async (req, reply) => {
    const id = String((req.params as any).id);
    const snap = await getTripSnapshot(id);
    if (!snap.trip) {
      return reply.status(404).send({ ok: false, error: "trip_not_found" });
    }
    return reply.send({
      ok: true,
      trip: snap.trip,
      lastEvent: snap.lastEvent
    });
  });

  app.get("/api/trips/:id/timeline", async (req, reply) => {
    const id = String((req.params as any).id);
    const eventsLimitRaw = Number((req.query as any)?.eventsLimit ?? 20);
    const progressLimitRaw = Number((req.query as any)?.progressLimit ?? 50);
    const eventsLimit = Number.isFinite(eventsLimitRaw) ? eventsLimitRaw : 20;
    const progressLimit = Number.isFinite(progressLimitRaw) ? progressLimitRaw : 50;
    const snap = await getTripSnapshot(id);
    if (!snap.trip) {
      return reply.status(404).send({ ok: false, error: "trip_not_found" });
    }
    const [events, progress] = await Promise.all([
      listTripEvents(id, eventsLimit),
      listTripProgress(id, progressLimit)
    ]);
    return reply.send({
      ok: true,
      trip: snap.trip,
      lastEvent: snap.lastEvent,
      eventsCount: events.length,
      progressCount: progress.length,
      events,
      progress
    });
  });
}
