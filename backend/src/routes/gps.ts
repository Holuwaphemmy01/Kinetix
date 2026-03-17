import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { haversineKm, getState } from "../services/progress";
import { toIdHex } from "../vault";
import { recordProgress } from "../db";
import { TICK_AMOUNT_CNGN } from "../config";

export function registerGpsRoutes(app: FastifyInstance, vault: any) {
  const gpsSchema = z.object({
    tripId: z.string().min(1),
    lat: z.number(),
    lng: z.number(),
    dropLat: z.number(),
    dropLng: z.number(),
    timestamp: z.number(),
    rider: z.string().min(1)
  });
  app.post("/api/gps/ingest", async (req, reply) => {
    const body = gpsSchema.parse(req.body);
    if (!vault) {
      return reply.status(500).send({ ok: false, error: "vault_not_configured" });
    }
    const idHex = toIdHex(body.tripId);
    const dKm = haversineKm(body.lat, body.lng, body.dropLat, body.dropLng);
    const s = getState(body.tripId);
    const prev = s.lastDist;
    s.lastDist = dKm;
    s.lastLat = body.lat;
    s.lastLng = body.lng;
    if (prev != null && dKm < prev) {
      const advanced = (prev - dKm) * 1000;
      s.accum += advanced;
      try {
        const meters = Math.floor(advanced);
        await vault.reportProgress(idHex, meters);
      } catch {}
      try {
        await recordProgress({
          tripId: body.tripId,
          lat: body.lat,
          lng: body.lng,
          dropLat: body.dropLat,
          dropLng: body.dropLng,
          distanceKm: dKm,
          metersAdvanced: Math.floor(advanced),
          monotonic: true,
          ts: body.timestamp
        });
      } catch {}
      if (!s.frozen && s.accum >= 500) {
        s.accum = 0;
        try {
          await vault.tickStream(idHex, TICK_AMOUNT_CNGN);
        } catch {}
      }
    } else {
      try {
        await recordProgress({
          tripId: body.tripId,
          lat: body.lat,
          lng: body.lng,
          dropLat: body.dropLat,
          dropLng: body.dropLng,
          distanceKm: dKm,
          metersAdvanced: 0,
          monotonic: false,
          ts: body.timestamp
        });
      } catch {}
    }
    return reply.send({ ok: true });
  });
}
