"use client";

import { useState } from "react";
import { Pencil, X, Flame } from "lucide-react";
import type { UserRow, EntryRow, GoalsRow } from "@/lib/supabase/types";
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

  const accent      = isHummd ? "var(--hummd)"       : "var(--hafsa)";
  const accentDark  = isHummd ? "var(--hummd-dark)"  : "var(--hafsa-dark)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";
  const tilt        = isHummd ? "-1.5deg" : "1.5deg";

  return (
    <div
      className="relative animate-paper-drop"
      style={{
        "--card-tilt": tilt,
        animationDelay: isHummd ? "0s" : "0.1s",
        paddingBottom: "14px", // room for stack layers below
        paddingRight: "14px",
      } as React.CSSProperties}
    >
      {/* Paper stack — layers 3 and 2 behind */}
      <div
        className="absolute rounded-paper"
        style={{
          inset: 0,
          bottom: 0,
          right: 0,
          background: "var(--paper-3)",
          transform: `translate(12px, 14px) rotate(${isHummd ? "3deg" : "-3deg"})`,
          border: "1.5px solid rgba(28,16,6,0.07)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-paper"
        style={{
          inset: 0,
          bottom: 0,
          right: 0,
          background: "var(--paper-2)",
          transform: `translate(6px, 7px) rotate(${isHummd ? "1.5deg" : "-1.5deg"})`,
          border: "1.5px solid rgba(28,16,6,0.09)",
          zIndex: 1,
        }}
      />

      {/* Front card — the main paper sheet */}
      <div
        className={cn(
          "relative rounded-paper overflow-visible transition-transform duration-300",
          "hover:-translate-y-1"
        )}
        style={{
          background: "var(--paper-0)",
          border: `2px solid rgba(28,16,6,0.13)`,
          boxShadow: "var(--shadow-card)",
          zIndex: 2,
          transform: `rotate(${tilt})`,
        }}
      >
        {/* Tape at top */}
        <div
          className="absolute -top-3 left-1/2 z-10"
          style={{
            transform: `translateX(-50%) rotate(${isHummd ? "-1.8deg" : "1.8deg"})`,
            width: "60px",
            height: "16px",
            background: "var(--tape-bg)",
            border: "1px solid var(--tape-border)",
            borderRadius: "2px",
            boxShadow: "0 1px 3px rgba(28,16,6,0.12)",
          }}
        />

        {/* Colored header band — like construction paper strip glued on */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: accentPaper,
            borderBottom: `2px solid ${accent}`,
            borderRadius: "3px 7px 0 0",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Emoji sticker */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: accentLight,
                border: `2px solid ${accent}`,
                boxShadow: "var(--shadow-xs)",
              }}
            >
              {user.emoji}
            </div>
            <div>
              <h2
                className="font-fraunces font-black text-xl leading-tight"
                style={{ color: "var(--ink)" }}
              >
                {user.name}
              </h2>
              {entry?.calories_burnt != null && (
                <p
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "var(--burnt-color, #D4620C)", fontFamily: "var(--font-kalam)" }}
                >
                  <Flame className="w-3 h-3" />
                  {entry.calories_burnt} kcal burnt today
                </p>
              )}
            </div>
          </div>

          {/* Edit button — looks like a paper tab */}
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center justify-center w-9 h-9 transition-all duration-150 hover:-rotate-6"
            style={{
              background: editing ? "var(--paper-2)" : accentLight,
              border: `2px solid ${editing ? "rgba(28,16,6,0.2)" : accent}`,
              borderRadius: "5px 9px 6px 8px",
              boxShadow: "var(--shadow-xs)",
              color: editing ? "var(--ink-mid)" : accent,
            }}
            title={editing ? "Close" : "Log today's entry"}
          >
            {editing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
        </div>

        {/* Card body */}
        <div className="p-5">
          {editing ? (
            <div className="animate-paper-unfold" style={{ transformOrigin: "top" }}>
              <LogForm
                user={user}
                date={date}
                existing={entry}
                onSuccess={() => setEditing(false)}
              />
            </div>
          ) : entry ? (
            <div>
              {/* Macro rings row */}
              <div className="flex items-start justify-around gap-1">
                <MacroRing type="calories" value={entry.calories} target={calorieTarget} color={user.color} />
                <MacroRing type="protein"  value={entry.protein}  target={proteinTarget} color={user.color} />
                <MacroRing type="fibre"    value={entry.fibre}    target={fibreTarget}   color={user.color} />
              </div>

              {/* Net calories strip — like a paper receipt */}
              {entry.calories_burnt != null && entry.calories != null && (
                <div
                  className="mt-4 px-4 py-2.5 text-xs text-center font-fraunces font-semibold"
                  style={{
                    background: accentPaper,
                    border: `1.5px dashed ${accent}`,
                    borderRadius: "3px 7px 4px 6px",
                    color: "var(--ink-mid)",
                  }}
                >
                  Net calories:{" "}
                  <span className="font-black" style={{ color: "var(--ink)" }}>
                    {entry.calories - entry.calories_burnt} kcal
                  </span>
                  <span style={{ opacity: 0.6 }}> after {entry.calories_burnt} burnt</span>
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-6">
              <p className="text-4xl mb-2 opacity-60">📋</p>
              <p
                className="text-sm"
                style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
              >
                Nothing logged yet today
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 btn-sticker"
                style={{ background: accentPaper, color: "var(--ink)" }}
              >
                Log now ✦
              </button>
            </div>
          )}
        </div>

        {/* Curled corner */}
        <div
          className="absolute bottom-0 right-0 pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M22 22 L0 22 Q22 22 22 0 Z" fill="var(--paper-3)" opacity="0.9" />
            <path d="M22 22 L0 22 Q22 22 22 0 Z" stroke="rgba(28,16,6,0.10)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}
