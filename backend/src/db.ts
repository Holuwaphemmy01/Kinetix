import { Pool } from "pg";

const url = process.env.DATABASE_URL || "";
export const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false }
});

export async function ensureTables() {
  await pool.query(`
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
    );
    CREATE INDEX IF NOT EXISTS idx_trip_progress_trip_ts ON trip_progress (trip_id, ts);
    CREATE TABLE IF NOT EXISTS idempotency_keys (
      scope TEXT NOT NULL,
      key TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (scope, key)
    );
  `);
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
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
  const q = `
    INSERT INTO trip_progress (trip_id, lat, lng, drop_lat, drop_lng, distance_km, meters_advanced, monotonic, ts)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
  `;
  const v = [
    input.tripId,
    input.lat,
    input.lng,
    input.dropLat,
    input.dropLng,
    input.distanceKm,
    input.metersAdvanced,
    input.monotonic,
    input.ts
  ];
  await pool.query(q, v);
}
