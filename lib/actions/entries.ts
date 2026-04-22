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
    .eq("date", dateStr)
    .order("created_at", { ascending: true });

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
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as EntryRow[];
}

export async function addEntry(
  userId: string,
  date: Date,
  data: EntryInput
): Promise<void> {
  const supabase = await createClient();
  const dateStr = formatDateISO(date);

  const { error } = await supabase.from("entries").insert({
    user_id: userId,
    date: dateStr,
    meal_name: data.meal_name ?? null,
    calories: data.calories ?? null,
    protein: data.protein ?? null,
    fibre: data.fibre ?? null,
    calories_burnt: data.calories_burnt ?? null,
  } as Record<string, unknown>);

  if (error) throw new Error(error.message);
  revalidatePath("/today");
  revalidatePath("/history");
  revalidatePath("/progress");
}

export async function updateEntry(id: string, data: EntryInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("entries")
    .update({
      meal_name:      data.meal_name      ?? null,
      calories:       data.calories       ?? null,
      protein:        data.protein        ?? null,
      fibre:          data.fibre          ?? null,
      calories_burnt: data.calories_burnt ?? null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/today");
  revalidatePath("/history");
  revalidatePath("/progress");
}

export async function deleteEntry(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/today");
  revalidatePath("/history");
  revalidatePath("/progress");
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
