"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { GoalInput, GoalsRow } from "@/lib/supabase/types";

export async function getGoalsForAllUsers(): Promise<GoalsRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("daily_goals").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []) as GoalsRow[];
}

export async function upsertGoals(
  userId: string,
  goals: GoalInput
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("daily_goals").upsert(
    {
      user_id: userId,
      calories_target: goals.calories_target,
      protein_target: goals.protein_target,
      fibre_target: goals.fibre_target,
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>,
    { onConflict: "user_id" }
  );

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
  revalidatePath("/today");
  revalidatePath("/progress");
}
