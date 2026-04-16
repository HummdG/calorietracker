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
  const getEntries = (userId: string) => entries.filter((e) => e.user_id === userId);
  const getGoals = (userId: string) => goals.find((g) => g.user_id === userId) ?? null;

  return (
    <div>
      {/* Page header — pinned title card */}
      <div className="mb-8 animate-paper-drop" style={{ "--card-tilt": "0.3deg" } as React.CSSProperties}>
        <div
          className="inline-block relative"
          style={{ transform: "rotate(0.3deg)" }}
        >
          {/* Tape on title */}
          <div
            className="absolute -top-2.5 left-8"
            style={{
              width: "52px",
              height: "14px",
              background: "var(--tape-bg)",
              border: "1px solid var(--tape-border)",
              borderRadius: "2px",
              transform: "rotate(-2deg)",
              zIndex: 2,
            }}
          />
          <div
            className="relative px-6 py-3 rounded-paper"
            style={{
              background: "var(--paper-0)",
              border: "2px solid rgba(28,16,6,0.12)",
              boxShadow: "var(--shadow-sm)",
              zIndex: 1,
            }}
          >
            <h1 className="font-fraunces font-black text-2xl leading-none" style={{ color: "var(--ink)" }}>
              Today ✦
            </h1>
            <p
              className="text-xs mt-1 capitalize"
              style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
            >
              {formatDateFull(date)}
            </p>
          </div>
        </div>
      </div>

      {/* User cards — on the stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            entries={getEntries(user.id)}
            goals={getGoals(user.id)}
            date={date}
          />
        ))}
      </div>

      {/* Footer note — scrawled at the bottom of the stage */}
      <div
        className="mt-10 text-center"
        style={{
          opacity: 0.4,
          transform: "rotate(-0.4deg)",
          fontFamily: "var(--font-kalam)",
          color: "var(--ink-mid)",
          fontSize: "0.8rem",
        }}
      >
        keep going, you&apos;re doing great 💪
      </div>
    </div>
  );
}
