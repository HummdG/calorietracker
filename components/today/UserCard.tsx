"use client";

import { useState } from "react";
import { Pencil, X, Flame } from "lucide-react";
import type { UserRow, EntryRow, GoalsRow } from "@/lib/supabase/types";
import { EmojiAvatar } from "@/components/ui/EmojiAvatar";
import { MacroRing } from "./MacroRing";
import { LogForm } from "./LogForm";
import { cn } from "@/lib/utils/cn";

interface UserCardProps {
  user: UserRow;
  entry: EntryRow | null;
  goals: GoalsRow | null;
  date: Date;
}

export function UserCard({ user, entry, goals, date }: UserCardProps) {
  const [editing, setEditing] = useState(false);
  const isHummd = user.color === "hummd";

  const calorieTarget = goals?.calories_target ?? 2000;
  const proteinTarget = goals?.protein_target ?? 150;
  const fibreTarget = goals?.fibre_target ?? 30;

  return (
    <div
      className={cn(
        "rounded-3xl border-2 bg-white shadow-sm transition-all duration-300",
        "hover:shadow-md",
        isHummd ? "border-hummd-100" : "border-hafsa-100"
      )}
    >
      {/* Card header */}
      <div
        className={cn(
          "flex items-center justify-between px-5 py-4 rounded-t-3xl",
          isHummd ? "bg-hummd-50" : "bg-hafsa-50"
        )}
      >
        <div className="flex items-center gap-3">
          <EmojiAvatar emoji={user.emoji} color={user.color} size="md" />
          <div>
            <h2
              className={cn(
                "text-lg font-extrabold",
                isHummd ? "text-hummd-700" : "text-hafsa-700"
              )}
            >
              {user.name}
            </h2>
            {entry?.calories_burnt != null && (
              <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span className="text-orange-500 font-bold">{entry.calories_burnt} kcal burnt</span>
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150",
            editing
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
              : isHummd
              ? "bg-hummd-100 text-hummd-600 hover:bg-hummd-200"
              : "bg-hafsa-100 text-hafsa-600 hover:bg-hafsa-200"
          )}
          title={editing ? "Close" : "Edit today's entry"}
        >
          {editing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </button>
      </div>

      {/* Card body */}
      <div className="p-5">
        {editing ? (
          <div className="animate-fade-in">
            <LogForm
              user={user}
              date={date}
              existing={entry}
              onSuccess={() => setEditing(false)}
            />
          </div>
        ) : entry ? (
          <div className="animate-fade-in">
            {/* Macro rings */}
            <div className="flex items-start justify-around gap-2">
              <MacroRing
                type="calories"
                value={entry.calories}
                target={calorieTarget}
                color={user.color}
              />
              <MacroRing
                type="protein"
                value={entry.protein}
                target={proteinTarget}
                color={user.color}
              />
              <MacroRing
                type="fibre"
                value={entry.fibre}
                target={fibreTarget}
                color={user.color}
              />
            </div>

            {/* Net calories note */}
            {entry.calories_burnt != null && entry.calories != null && (
              <div
                className={cn(
                  "mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-center",
                  isHummd ? "bg-hummd-50 text-hummd-600" : "bg-hafsa-50 text-hafsa-600"
                )}
              >
                Net calories:{" "}
                <span className="font-extrabold">
                  {entry.calories - entry.calories_burnt} kcal
                </span>{" "}
                (after {entry.calories_burnt} burnt)
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="animate-fade-in text-center py-6">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-gray-400 text-sm font-medium">No entry yet today</p>
            <button
              onClick={() => setEditing(true)}
              className={cn(
                "mt-3 px-5 py-2 rounded-full text-sm font-bold text-white transition-all duration-150 hover:scale-105 active:scale-95",
                isHummd ? "bg-hummd-500" : "bg-hafsa-500"
              )}
            >
              Log now ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
