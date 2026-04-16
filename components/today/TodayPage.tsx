"use client";

import type { UserRow, EntryRow, GoalsRow } from "@/lib/supabase/types";
import { UserCard } from "./UserCard";
import { formatDateFull } from "@/lib/utils/dates";

interface TodayPageProps {
  users: UserRow[];
  entries: EntryRow[];
  goals: GoalsRow[];
  date: Date;
}

export function TodayPage({ users, entries, goals, date }: TodayPageProps) {
  const getEntry = (userId: string) =>
    entries.find((e) => e.user_id === userId) ?? null;

  const getGoals = (userId: string) =>
    goals.find((g) => g.user_id === userId) ?? null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-extrabold text-gray-800">Today ✨</h1>
        <p className="text-sm text-gray-400 mt-0.5 font-medium capitalize">
          {formatDateFull(date)}
        </p>
      </div>

      {/* Two-column user cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            entry={getEntry(user.id)}
            goals={getGoals(user.id)}
            date={date}
          />
        ))}
      </div>

      {/* Encouragement footer */}
      <div className="mt-6 text-center animate-fade-in">
        <p className="text-sm text-gray-300 font-medium">
          Keep going, you&apos;re doing great! 💪
        </p>
      </div>
    </div>
  );
}
