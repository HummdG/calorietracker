"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DailyWeightRow } from "@/lib/supabase/types";
import { formatDateISO } from "@/lib/utils/dates";

export async function getWeightsForDate(date: Date): Promise<DailyWeightRow[]> {
  const supabase = await createClient();
  const dateStr = formatDateISO(date);

  const { data, error } = await supabase
    .from("daily_weights")
    .select("*")
    .eq("date", dateStr);

  if (error) throw new Error(error.message);
  return (data ?? []) as DailyWeightRow[];
}

export async function upsertWeight(
  userId: string,
  date: Date,
  weight: number
): Promise<void> {
  const supabase = await createClient();
  const dateStr = formatDateISO(date);

  const { error } = await supabase.from("daily_weights").upsert(
    {
      user_id: userId,
      date: dateStr,
      weight,
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>,
    { onConflict: "user_id,date" }
  );

  if (error) throw new Error(error.message);
  revalidatePath("/today");
  revalidatePath("/progress");
  revalidatePath("/history");
}
