CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  provider TEXT NOT NULL,
  reference TEXT NOT NULL,
  event TEXT NOT NULL,
  amount_kobo BIGINT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status TEXT NOT NULL DEFAULT 'unknown',
  trip_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_payments_provider_reference
  ON payments (provider, reference);

CREATE INDEX IF NOT EXISTS idx_payments_trip
  ON payments (trip_id);
