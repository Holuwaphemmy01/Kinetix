import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { haversineKm, getState } from "../services/progress";
import { toIdHex } from "../vault";
import { addTripEvent, getTripCorridor, recordProgress, setTripFrozen } from "../db";
import { TICK_AMOUNT_CNGN } from "../config";
import { minDistanceToCorridorMeters, reverseVectorScore } from "../services/corridor";
import { enqueueReportDeviation, enqueueReportReentry, enqueueTickStream } from "../queue";
import { requireServiceOrAdmin } from "../auth";

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
  app.post("/api/gps/ingest", { preHandler: requireServiceOrAdmin }, async (req, reply) => {
    const body = gpsSchema.parse(req.body);
    if (!vault) {
      return reply.status(500).send({ ok: false, error: "vault_not_configured" });
    }
    const idHex = toIdHex(body.tripId);
    const dKm = haversineKm(body.lat, body.lng, body.dropLat, body.dropLng);
    const s = getState(body.tripId);
    const prev = s.lastDist;
    const prevLat = s.lastLat;
    const prevLng = s.lastLng;
    s.lastDist = dKm;
    s.lastLat = body.lat;
    s.lastLng = body.lng;
    const corridorCfg = await getTripCorridor(body.tripId).catch(() => null);
    if (corridorCfg) {
      const minMeters = minDistanceToCorridorMeters({ lat: body.lat, lng: body.lng }, corridorCfg.corridor);
      let score = 1;
      if (prevLat != null && prevLng != null) {
        score = reverseVectorScore(
          { lat: prevLat, lng: prevLng },
          { lat: body.lat, lng: body.lng },
          { lat: body.dropLat, lng: body.dropLng }
        );
      }
      const shouldFreeze = minMeters > corridorCfg.bufferMeters || score < -0.2;
      const shouldUnfreeze = s.frozen && minMeters <= Math.max(30, Math.floor(corridorCfg.bufferMeters * 0.6)) && score >= -0.1;
      if (!s.frozen && shouldFreeze) {
        s.frozen = true;
        try {
          await enqueueReportDeviation({
            tripId: body.tripId,
            tripIdHex: idHex,
            vectorScaled: Math.floor(score * 1000)
          });
        } catch {}
        await setTripFrozen(body.tripId, true).catch(() => null);
        await addTripEvent(body.tripId, "freeze", { minMeters, bufferMeters: corridorCfg.bufferMeters, vectorScore: score }).catch(() => null);
      } else if (shouldUnfreeze) {
        s.frozen = false;
        try {
          await enqueueReportReentry({
            tripId: body.tripId,
            tripIdHex: idHex
          });
        } catch {}
        await setTripFrozen(body.tripId, false).catch(() => null);
        await addTripEvent(body.tripId, "unfreeze", { minMeters, bufferMeters: corridorCfg.bufferMeters, vectorScore: score }).catch(() => null);
      }
    }
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
          await enqueueTickStream({
            tripId: body.tripId,
            tripIdHex: idHex,
            amountWei: TICK_AMOUNT_CNGN.toString()
          });
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
