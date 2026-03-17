import postgres from "postgres";
import { DATABASE_URL } from "./config";

export const sql = postgres(DATABASE_URL, { ssl: "require" });

export async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS trip_progress (
      trip_id TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      drop_lat DOUBLE PRECISION NOT NULL,
      drop_lng DOUBLE PRECISION NOT NULL,
      distance_km DOUBLE PRECISION NOT NULL,
      meters_advanced INTEGER NOT NULL,
      monotonic BOOLEAN NOT NULL,
      ts BIGINT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_trip_progress_trip_ts ON trip_progress (trip_id, ts)`;
  await sql`
    CREATE TABLE IF NOT EXISTS idempotency_keys (
      scope TEXT NOT NULL,
      key TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (scope, key)
    )
  `;
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
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
  await sql`
    INSERT INTO trip_progress (trip_id, lat, lng, drop_lat, drop_lng, distance_km, meters_advanced, monotonic, ts)
    VALUES (${input.tripId}, ${input.lat}, ${input.lng}, ${input.dropLat}, ${input.dropLng}, ${input.distanceKm},
            ${input.metersAdvanced}, ${input.monotonic}, ${input.ts})
  `;
}
