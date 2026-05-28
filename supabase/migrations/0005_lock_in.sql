-- 30-day lock-in countdown — single shared row
CREATE TABLE IF NOT EXISTS lock_in (
  id         INT PRIMARY KEY DEFAULT 1,
  start_date DATE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT lock_in_singleton CHECK (id = 1)
);

-- Seed with 2026-05-26 so the current run shows day 3 (matches user expectation)
INSERT INTO lock_in (id, start_date)
VALUES (1, DATE '2026-05-26')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE lock_in ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_lock_in" ON lock_in FOR ALL USING (true) WITH CHECK (true);
