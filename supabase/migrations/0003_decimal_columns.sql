-- Allow decimal values for macro and calorie tracking
ALTER TABLE entries
  ALTER COLUMN calories       TYPE NUMERIC,
  ALTER COLUMN protein        TYPE NUMERIC,
  ALTER COLUMN fibre          TYPE NUMERIC,
  ALTER COLUMN calories_burnt TYPE NUMERIC;
