// Stable UUIDs matching supabase/seed.sql
// These allow client-side code to reference users without an extra DB round-trip.
export const USER_IDS = {
  Hummd: "a1b2c3d4-0001-0001-0001-000000000001",
  Hafsa: "a1b2c3d4-0002-0002-0002-000000000002",
} as const;

export type UserName = keyof typeof USER_IDS;
