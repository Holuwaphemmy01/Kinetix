CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  rider_address TEXT,
  customer_address TEXT,
  status TEXT NOT NULL DEFAULT 'created',
  frozen BOOLEAN NOT NULL DEFAULT FALSE,
  corridor JSONB,
  corridor_buffer_meters INTEGER NOT NULL DEFAULT 80,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trip_events (
  id BIGSERIAL PRIMARY KEY,
  trip_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trip_events_trip_time
  ON trip_events (trip_id, created_at);
