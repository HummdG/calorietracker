-- Daily bodyweight tracking — one row per user per day
CREATE TABLE IF NOT EXISTS daily_weights (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  weight     NUMERIC NOT NULL CHECK (weight > 0 AND weight < 500),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_weights_user_date ON daily_weights(user_id, date DESC);

ALTER TABLE daily_weights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_weights" ON daily_weights FOR ALL USING (true) WITH CHECK (true);
