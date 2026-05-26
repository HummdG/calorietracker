"use server";

import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { formatDateISO } from "@/lib/utils/dates";
import { getAllUsers } from "@/lib/actions/entries";

export interface SharedStreak {
  currentStreak: number;
  target: 30;
  bothLoggedToday: boolean;
  reward: boolean;
}

export async function getSharedStreak(): Promise<SharedStreak> {
  const supabase = await createClient();
  const users = await getAllUsers();

  // Need at least two users for a shared streak to be meaningful.
  if (users.length < 2) {
    return { currentStreak: 0, target: 30, bothLoggedToday: false, reward: false };
  }

  const today = new Date();
  const lookbackStart = subDays(today, 60);

  const { data, error } = await supabase
    .from("entries")
    .select("user_id,date")
    .gte("date", formatDateISO(lookbackStart));

  if (error) throw new Error(error.message);

  // Build Map<dateISO, Set<userId>> of who logged on which day.
  const byDate = new Map<string, Set<string>>();
  for (const row of (data ?? []) as Array<{ user_id: string; date: string }>) {
    const set = byDate.get(row.date) ?? new Set<string>();
    set.add(row.user_id);
    byDate.set(row.date, set);
  }

  const userCount = users.length;
  const todayISO = formatDateISO(today);
  const bothLoggedToday = (byDate.get(todayISO)?.size ?? 0) >= userCount;

  // Walk backwards from today (if everyone logged) or yesterday (today still in-progress).
  let cursor = bothLoggedToday ? today : subDays(today, 1);
  let streak = 0;
  while ((byDate.get(formatDateISO(cursor))?.size ?? 0) >= userCount) {
    streak++;
    cursor = subDays(cursor, 1);
  }

  return {
    currentStreak: streak,
    target: 30,
    bothLoggedToday,
    reward: streak >= 30,
  };
}
