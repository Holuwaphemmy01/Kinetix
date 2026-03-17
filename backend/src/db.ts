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
