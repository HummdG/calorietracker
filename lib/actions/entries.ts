"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { EntryInput, EntryRow, UserRow } from "@/lib/supabase/types";
import { formatDateISO } from "@/lib/utils/dates";

export async function getEntriesForDate(date: Date): Promise<EntryRow[]> {
  const supabase = await createClient();
  const dateStr = formatDateISO(date);

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("date", dateStr);

  if (error) throw new Error(error.message);
  return (data ?? []) as EntryRow[];
}

export async function getEntriesForRange(
  startDate: Date,
  endDate: Date
): Promise<EntryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .gte("date", formatDateISO(startDate))
    .lte("date", formatDateISO(endDate))
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as EntryRow[];
}

export async function upsertEntry(
  userId: string,
  date: Date,
  data: EntryInput,
  revalidate = true
): Promise<void> {
  const supabase = await createClient();
  const dateStr = formatDateISO(date);

  const { error } = await supabase.from("entries").upsert(
    {
      user_id: userId,
      date: dateStr,
      calories: data.calories ?? null,
      protein: data.protein ?? null,
      fibre: data.fibre ?? null,
      calories_burnt: data.calories_burnt ?? null,
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>,
    { onConflict: "user_id,date" }
  );

  if (error) throw new Error(error.message);
  if (revalidate) {
    revalidatePath("/today");
    revalidatePath("/history");
    revalidatePath("/progress");
  }
}

export async function getAllUsers(): Promise<UserRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as UserRow[];
}
