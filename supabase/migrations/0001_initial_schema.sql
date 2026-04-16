-- ============================================================
-- Calorie Tracker — Initial Schema
-- ============================================================

-- Static user lookup (seed with 2 rows after migration)
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,   -- 'Hummd' | 'Hafsa'
  emoji      TEXT NOT NULL,          -- '🧑' | '🧚🏻'
  color      TEXT NOT NULL,          -- 'hummd' | 'hafsa'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- One row per user, mutable via Settings page
CREATE TABLE IF NOT EXISTS daily_goals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  calories_target   INT NOT NULL DEFAULT 2000,
  protein_target    INT NOT NULL DEFAULT 150,
  fibre_target      INT NOT NULL DEFAULT 30,
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id)
);

-- One row per user per day — upsert on (user_id, date) conflict
CREATE TABLE IF NOT EXISTS entries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  calories       INT,
  protein        INT,
  fibre          INT,
  calories_burnt INT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT entries_user_date_unique UNIQUE (user_id, date)
);

-- Index for the most common query: last N days per user
CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, date DESC);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Open policies (no auth required for personal two-user app)
CREATE POLICY "allow_all_users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_goals" ON daily_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_entries" ON entries FOR ALL USING (true) WITH CHECK (true);
