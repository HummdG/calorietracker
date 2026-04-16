-- ============================================================
-- Seed: Users + Historical Entries (07/04/2026 – 15/04/2026)
-- Run this AFTER the migration.
-- ============================================================

-- Insert users (UUIDs are stable — copy them into lib/supabase/seed-ids.ts)
INSERT INTO users (id, name, emoji, color) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Hummd', '🧑', 'hummd'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Hafsa', '🧚🏻', 'hafsa')
ON CONFLICT (name) DO NOTHING;

-- Default goals (users will update these via Settings)
INSERT INTO daily_goals (user_id, calories_target, protein_target, fibre_target)
SELECT id, 2000, 140, 30 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO daily_goals (user_id, calories_target, protein_target, fibre_target)
SELECT id, 1600, 60, 25 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- Historical entries
-- ============================================================

-- 07/04/2026
INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-07', 140, 1670, 11 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-07', 44, 1330, 24 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

-- 08/04/2026
INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-08', 135, 1890, 31 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-08', 51, 1540, 27 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

-- 09/04/2026
INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-09', 125, 1432, 9 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-09', 50, 1307, 20 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

-- 10/04/2026
INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-10', 128, 2250, 25 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-10', 68, 1800, 19 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

-- 11/04/2026
INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-11', 55, 1200, 6 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-11', 67, 1730, 13 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

-- 12/04/2026
INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-12', 45, 1750, 15 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-12', 58, 1612, 16 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

-- 13/04/2026
INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-13', 96, 2036, 38 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-13', 25, 1686, 25 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

-- 14/04/2026 (calories_burnt: Hummd 450, Hafsa 637)
INSERT INTO entries (user_id, date, protein, calories, fibre, calories_burnt)
SELECT id, '2026-04-14', 110, 1833, 16, 450 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre, calories_burnt=EXCLUDED.calories_burnt;

INSERT INTO entries (user_id, date, protein, calories, fibre, calories_burnt)
SELECT id, '2026-04-14', 50, 1400, 22, 637 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre, calories_burnt=EXCLUDED.calories_burnt;

-- 15/04/2026
INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-15', 130, 2388, 30 FROM users WHERE name = 'Hummd'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;

INSERT INTO entries (user_id, date, protein, calories, fibre)
SELECT id, '2026-04-15', 65, 2200, 24 FROM users WHERE name = 'Hafsa'
ON CONFLICT (user_id, date) DO UPDATE SET protein=EXCLUDED.protein, calories=EXCLUDED.calories, fibre=EXCLUDED.fibre;
