"use server";

import { differenceInCalendarDays, parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formatDateISO } from "@/lib/utils/dates";

export interface LockInProgress {
  currentDay: number;
  target: 30;
  reward: boolean;
  startDate: string;
}

export async function getLockInProgress(): Promise<LockInProgress> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lock_in")
    .select("start_date")
    .eq("id", 1)
    .single();

  if (error) throw new Error(error.message);

  const row = data as { start_date: string };
  const start = parseISO(row.start_date);
  const today = new Date();
  const currentDay = Math.max(1, differenceInCalendarDays(today, start) + 1);

  return {
    currentDay,
    target: 30,
    reward: currentDay >= 30,
    startDate: row.start_date,
  };
}

export async function resetLockIn(): Promise<void> {
  const supabase = await createClient();
  const today = formatDateISO(new Date());

  const { error } = await supabase
    .from("lock_in")
    .upsert(
      {
        id: 1,
        start_date: today,
        updated_at: new Date().toISOString(),
      } as Record<string, unknown>,
      { onConflict: "id" }
    );

  if (error) throw new Error(error.message);
  revalidatePath("/today");
}
