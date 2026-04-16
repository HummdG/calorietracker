-- Allow multiple meal entries per user per day
ALTER TABLE entries DROP CONSTRAINT IF EXISTS entries_user_date_unique;

-- Optional meal name (e.g. "Breakfast", "Lunch", "Post-workout shake")
ALTER TABLE entries ADD COLUMN IF NOT EXISTS meal_name TEXT;
