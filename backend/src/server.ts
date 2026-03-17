import fastify from "fastify";
import { z } from "zod";
import { ethers } from "ethers";
import abi from "./abi/KinetixVault.json" assert { type: "json" };
import { ensureTables, recordProgress } from "./db";
import "dotenv/config";

const app = fastify({ logger: true });

const RPC_URL = process.env.SOMNIA_RPC_URL || "";
const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "";
const VAULT_ADDRESS = process.env.VAULT_ADDRESS || "";
const TICK_AMOUNT_CNGN = process.env.TICK_AMOUNT_CNGN ? BigInt(process.env.TICK_AMOUNT_CNGN) : BigInt("100000000000000000");

const provider = RPC_URL ? new ethers.JsonRpcProvider(RPC_URL) : null;
const wallet = provider && PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;
const vault = wallet && VAULT_ADDRESS ? new ethers.Contract(VAULT_ADDRESS, abi, wallet) : null;

const gpsSchema = z.object({
  tripId: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  dropLat: z.number(),
  dropLng: z.number(),
  timestamp: z.number(),
  rider: z.string().min(1)
});

const settleSchema = z.object({
  deliveryProof: z.string().min(1)
});

const vectorSchema = z.object({
  vector: z.number()
});

type ProgressState = { lastDist: number | null; accum: number; frozen: boolean; lastLat: number | null; lastLng: number | null };
const progress: Map<string, ProgressState> = new Map();

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 = Math.sin(dLng / 2) ** 2;
  const c = s1 + Math.cos(lat1) * Math.cos(lat2) * s2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(c)));
}

app.post("/api/gps/ingest", async (req, reply) => {
  const body = gpsSchema.parse(req.body);
  if (!vault) {
    return reply.status(500).send({ ok: false, error: "vault_not_configured" });
  }
  const idHex = ethers.id(body.tripId);
  const dKm = haversineKm(body.lat, body.lng, body.dropLat, body.dropLng);
  const s = progress.get(body.tripId) || { lastDist: null, accum: 0, frozen: false, lastLat: null, lastLng: null };
  const prev = s.lastDist;
  s.lastDist = dKm;
  s.lastLat = body.lat;
  s.lastLng = body.lng;
  progress.set(body.tripId, s);
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

app.post("/api/trips/:id/settle", async (req, reply) => {
  const p = settleSchema.parse(req.body);
  const id = String((req.params as any).id);
  if (!vault) {
    return reply.status(500).send({ ok: false, error: "vault_not_configured" });
  }
  const idHex = ethers.isHexString(id, 32) ? id : ethers.id(id);
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
  if (!vault) {
    return reply.status(500).send({ ok: false, error: "vault_not_configured" });
  }
  const idHex = ethers.isHexString(id, 32) ? id : ethers.id(id);
  const s = progress.get(id) || { lastDist: null, accum: 0, frozen: false, lastLat: null, lastLng: null };
  s.frozen = true;
  progress.set(id, s);
  try {
    await vault.reportDeviation(idHex, BigInt(Math.floor(b.vector)));
    return reply.send({ ok: true });
  } catch {
    return reply.status(500).send({ ok: false });
  }
});

app.post("/api/trips/:id/unfreeze", async (req, reply) => {
  const id = String((req.params as any).id);
  if (!vault) {
    return reply.status(500).send({ ok: false, error: "vault_not_configured" });
  }
  const idHex = ethers.isHexString(id, 32) ? id : ethers.id(id);
  const s = progress.get(id) || { lastDist: null, accum: 0, frozen: false, lastLat: null, lastLng: null };
  s.frozen = false;
  progress.set(id, s);
  try {
    await vault.reportReentry(idHex);
    return reply.send({ ok: true });
  } catch {
    return reply.status(500).send({ ok: false });
  }
});

app.post("/api/webhooks/paystack", async (req, reply) => {
  return reply.send({ ok: true });
});

const port = Number(process.env.PORT || 4000);
app.listen({ port, host: "0.0.0.0" }).then(async () => {
  try {
    await ensureTables();
  } catch (e) {
    app.log.error(e);
  }
  app.log.info({ port }, "server_ready");
});
