import postgres from "postgres";
import { DATABASE_URL, DATABASE_FALLBACK_URL } from "./config";

const urls = [DATABASE_URL, DATABASE_FALLBACK_URL]
  .filter(Boolean)
  .map((u) => u.replace(/^postgresql:\/\//, "postgres://"));
const clients = urls.map((u) => postgres(u, { ssl: "require", prepare: false }));
let active = 0;

async function runWithFallback<T>(fn: (sql: postgres.Sql) => Promise<T>): Promise<T> {
  if (clients.length === 0) throw new Error("DATABASE_URL not configured");
  let lastErr: unknown;
  for (let i = 0; i < clients.length; i++) {
    const idx = (active + i) % clients.length;
    try {
      const out = await fn(clients[idx]);
      active = idx;
      return out;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr as Error;
}

export async function dbQuery<T>(fn: (sql: postgres.Sql) => Promise<T>): Promise<T> {
  return runWithFallback(fn);
}

export async function execSql(sqlText: string): Promise<void> {
  await runWithFallback((sql) => sql.unsafe(sqlText));
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    await dbQuery((sql) => sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

export async function recordProgress(input: {
  tripId: string;
  lat: number;
  lng: number;
  dropLat: number;
  dropLng: number;
  distanceKm: number;
  metersAdvanced: number;
  monotonic: boolean;
  ts: number;
}) {
  await dbQuery((sql) => sql`
      INSERT INTO trip_progress (trip_id, lat, lng, drop_lat, drop_lng, distance_km, meters_advanced, monotonic, ts)
      VALUES (${input.tripId}, ${input.lat}, ${input.lng}, ${input.dropLat}, ${input.dropLng}, ${input.distanceKm},
              ${input.metersAdvanced}, ${input.monotonic}, ${input.ts})
    `);
}

export async function acquireIdempotency(scope: string, key: string): Promise<boolean> {
  const rows = await dbQuery((sql: any) => sql<{ key: string }[]>`
    INSERT INTO idempotency_keys (scope, key)
    VALUES (${scope}, ${key})
    ON CONFLICT (scope, key) DO NOTHING
    RETURNING key
  `) as Array<{ key: string }>;
  return rows.length > 0;
}

export async function upsertPayment(input: {
  provider: string;
  reference: string;
  event: string;
  amountKobo: number;
  currency: string;
  status: string;
  tripId: string | null;
  payload: unknown;
}) {
  await dbQuery((sql: any) => sql`
    INSERT INTO payments (provider, reference, event, amount_kobo, currency, status, trip_id, payload)
    VALUES (
      ${input.provider},
      ${input.reference},
      ${input.event},
      ${input.amountKobo},
      ${input.currency},
      ${input.status},
      ${input.tripId},
      ${sql.json(input.payload)}
    )
    ON CONFLICT (provider, reference)
    DO UPDATE SET
      event = EXCLUDED.event,
      amount_kobo = EXCLUDED.amount_kobo,
      currency = EXCLUDED.currency,
      status = EXCLUDED.status,
      trip_id = EXCLUDED.trip_id,
      payload = EXCLUDED.payload,
      updated_at = NOW()
  `);
}

export type CorridorPoint = { lat: number; lng: number };

export async function upsertTripCorridor(input: { tripId: string; corridor: CorridorPoint[]; bufferMeters: number }) {
  await dbQuery((sql: any) => sql`
    INSERT INTO trips (id, corridor, corridor_buffer_meters, updated_at)
    VALUES (${input.tripId}, ${sql.json(input.corridor)}, ${input.bufferMeters}, NOW())
    ON CONFLICT (id)
    DO UPDATE SET
      corridor = EXCLUDED.corridor,
      corridor_buffer_meters = EXCLUDED.corridor_buffer_meters,
      updated_at = NOW()
  `);
}

export async function getTripCorridor(tripId: string): Promise<{ corridor: CorridorPoint[]; bufferMeters: number } | null> {
  const rows = await dbQuery((sql: any) => sql<{ corridor: CorridorPoint[] | null; corridor_buffer_meters: number }[]>`
    SELECT corridor, corridor_buffer_meters
    FROM trips
    WHERE id = ${tripId}
    LIMIT 1
  `) as Array<{ corridor: CorridorPoint[] | null; corridor_buffer_meters: number }>;
  if (!rows.length || !rows[0].corridor) return null;
  return { corridor: rows[0].corridor, bufferMeters: rows[0].corridor_buffer_meters || 80 };
}

export async function setTripFrozen(tripId: string, frozen: boolean) {
  await dbQuery((sql: any) => sql`
    INSERT INTO trips (id, frozen, updated_at)
    VALUES (${tripId}, ${frozen}, NOW())
    ON CONFLICT (id)
    DO UPDATE SET
      frozen = EXCLUDED.frozen,
      updated_at = NOW()
  `);
}

export async function addTripEvent(tripId: string, eventType: string, payload: unknown) {
  await dbQuery((sql: any) => sql`
    INSERT INTO trip_events (trip_id, event_type, payload)
    VALUES (${tripId}, ${eventType}, ${sql.json(payload)})
  `);
}

export async function listTripEvents(tripId: string, limit = 50) {
  const safeLimit = Math.max(1, Math.min(500, Number.isFinite(limit) ? Math.floor(limit) : 50));
  return dbQuery((sql: any) => sql<{
    id: number;
    trip_id: string;
    event_type: string;
    payload: unknown;
    created_at: string;
  }[]>`
    SELECT id, trip_id, event_type, payload, created_at
    FROM trip_events
    WHERE trip_id = ${tripId}
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `) as Promise<Array<{
    id: number;
    trip_id: string;
    event_type: string;
    payload: unknown;
    created_at: string;
  }>>;
}

export async function getTripSnapshot(tripId: string) {
  const tripRows = await dbQuery((sql: any) => sql<{
    id: string;
    rider_address: string | null;
    customer_address: string | null;
    status: string;
    frozen: boolean;
    corridor: CorridorPoint[] | null;
    corridor_buffer_meters: number;
    created_at: string;
    updated_at: string;
  }[]>`
    SELECT id, rider_address, customer_address, status, frozen, corridor, corridor_buffer_meters, created_at, updated_at
    FROM trips
    WHERE id = ${tripId}
    LIMIT 1
  `) as Array<{
    id: string;
    rider_address: string | null;
    customer_address: string | null;
    status: string;
    frozen: boolean;
    corridor: CorridorPoint[] | null;
    corridor_buffer_meters: number;
    created_at: string;
    updated_at: string;
  }>;

  const eventRows = await dbQuery((sql: any) => sql<{
    id: number;
    event_type: string;
    payload: unknown;
    created_at: string;
  }[]>`
    SELECT id, event_type, payload, created_at
    FROM trip_events
    WHERE trip_id = ${tripId}
    ORDER BY created_at DESC
    LIMIT 1
  `) as Array<{
    id: number;
    event_type: string;
    payload: unknown;
    created_at: string;
  }>;

  return {
    trip: tripRows[0] ?? null,
    lastEvent: eventRows[0] ?? null
  };
}

export async function listTripProgress(tripId: string, limit = 50) {
  const safeLimit = Math.max(1, Math.min(500, Number.isFinite(limit) ? Math.floor(limit) : 50));
  return dbQuery((sql: any) => sql<{
    trip_id: string;
    lat: number;
    lng: number;
    drop_lat: number;
    drop_lng: number;
    distance_km: number;
    meters_advanced: number;
    monotonic: boolean;
    ts: number;
    created_at: string;
  }[]>`
    SELECT trip_id, lat, lng, drop_lat, drop_lng, distance_km, meters_advanced, monotonic, ts, created_at
    FROM trip_progress
    WHERE trip_id = ${tripId}
    ORDER BY ts DESC, created_at DESC
    LIMIT ${safeLimit}
  `) as Promise<Array<{
    trip_id: string;
    lat: number;
    lng: number;
    drop_lat: number;
    drop_lng: number;
    distance_km: number;
    meters_advanced: number;
    monotonic: boolean;
    ts: number;
    created_at: string;
  }>>;
}
