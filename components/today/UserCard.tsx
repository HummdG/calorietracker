"use client";

import { useState, useTransition } from "react";
import { Plus, X, Flame, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { UserRow, EntryRow, GoalsRow } from "@/lib/supabase/types";
import { MacroRing } from "./MacroRing";
import { LogForm } from "./LogForm";
import { MacroBadge } from "@/components/ui/MacroBadge";
import { deleteEntry } from "@/lib/actions/entries";
import { cn } from "@/lib/utils/cn";

interface UserCardProps {
  user: UserRow;
  entries: EntryRow[];
  goals: GoalsRow | null;
  date: Date;
}

function sumOrNull(entries: EntryRow[], key: "calories" | "protein" | "fibre"): number | null {
  const vals = entries.map((e) => e[key]).filter((v): v is number => v != null);
  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) : null;
}

// Calories burnt is a status update — only the most recent entry counts
function latestBurnt(entries: EntryRow[]): number | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    const v = entries[i].calories_burnt;
    if (v != null) return v;
  }
  return null;
}

export function UserCard({ user, entries, goals, date }: UserCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [deletingId, startDeleteTransition] = useTransition();
  const isHummd = user.color === "hummd";

  const calorieTarget = goals?.calories_target ?? 2000;
  const proteinTarget = goals?.protein_target ?? 150;
  const fibreTarget   = goals?.fibre_target   ?? 30;

  const accent      = isHummd ? "var(--hummd)"       : "var(--hafsa)";
  const accentDark  = isHummd ? "var(--hummd-dark)"  : "var(--hafsa-dark)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";
  const tilt        = isHummd ? "-1.5deg" : "1.5deg";

  const totals = {
    calories:       sumOrNull(entries, "calories"),
    protein:        sumOrNull(entries, "protein"),
    fibre:          sumOrNull(entries, "fibre"),
    calories_burnt: latestBurnt(entries),
  };

  const handleDelete = (id: string) => {
    startDeleteTransition(async () => {
      await deleteEntry(id);
    });
  };

  return (
    <div
      className="relative animate-paper-drop"
      style={{
        "--card-tilt": tilt,
        animationDelay: isHummd ? "0s" : "0.1s",
        paddingBottom: "14px",
        paddingRight: "14px",
      } as React.CSSProperties}
    >
      {/* Paper stack layers */}
      <div
        className="absolute rounded-paper"
        style={{
          inset: 0, bottom: 0, right: 0,
          background: "var(--paper-3)",
          transform: `translate(12px, 14px) rotate(${isHummd ? "3deg" : "-3deg"})`,
          border: "1.5px solid rgba(28,16,6,0.07)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-paper"
        style={{
          inset: 0, bottom: 0, right: 0,
          background: "var(--paper-2)",
          transform: `translate(6px, 7px) rotate(${isHummd ? "1.5deg" : "-1.5deg"})`,
          border: "1.5px solid rgba(28,16,6,0.09)",
          zIndex: 1,
        }}
      />

      {/* Front card */}
      <div
        className={cn("relative rounded-paper overflow-visible transition-transform duration-300", "hover:-translate-y-1")}
        style={{
          background: "var(--paper-0)",
          border: `2px solid rgba(28,16,6,0.13)`,
          boxShadow: "var(--shadow-card)",
          zIndex: 2,
          transform: `rotate(${tilt})`,
        }}
      >
        {/* Tape */}
        <div
          className="absolute -top-3 left-1/2 z-10"
          style={{
            transform: `translateX(-50%) rotate(${isHummd ? "-1.8deg" : "1.8deg"})`,
            width: "60px", height: "16px",
            background: "var(--tape-bg)",
            border: "1px solid var(--tape-border)",
            borderRadius: "2px",
            boxShadow: "0 1px 3px rgba(28,16,6,0.12)",
          }}
        />

        {/* Header band */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: accentPaper,
            borderBottom: `2px solid ${accent}`,
            borderRadius: "3px 7px 0 0",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: accentLight, border: `2px solid ${accent}`, boxShadow: "var(--shadow-xs)" }}
            >
              {user.emoji}
            </div>
            <div>
              <h2 className="font-fraunces font-black text-xl leading-tight" style={{ color: "var(--ink)" }}>
                {user.name}
              </h2>
              {totals.calories_burnt != null && (
                <p className="flex items-center gap-1 text-xs" style={{ color: "var(--burnt-color, #D4620C)", fontFamily: "var(--font-kalam)" }}>
                  <Flame className="w-3 h-3" />
                  {totals.calories_burnt} kcal burnt today
                </p>
              )}
            </div>
          </div>

          {/* Add / close button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center w-9 h-9 transition-all duration-150 hover:-rotate-6"
            style={{
              background: showForm ? "var(--paper-2)" : accentLight,
              border: `2px solid ${showForm ? "rgba(28,16,6,0.2)" : accent}`,
              borderRadius: "5px 9px 6px 8px",
              boxShadow: "var(--shadow-xs)",
              color: showForm ? "var(--ink-mid)" : accent,
            }}
            title={showForm ? "Close" : "Add a meal entry"}
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Card body */}
        <div className="p-5">
          {entries.length > 0 ? (
            <div>
              {/* Macro rings — show totals */}
              <div className="flex items-start justify-around gap-1">
                <MacroRing type="calories" value={totals.calories} target={calorieTarget} color={user.color} />
                <MacroRing type="protein"  value={totals.protein}  target={proteinTarget} color={user.color} />
                <MacroRing type="fibre"    value={totals.fibre}    target={fibreTarget}   color={user.color} />
              </div>

              {/* Net calories */}
              {totals.calories_burnt != null && totals.calories != null && (
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
                    {totals.calories - totals.calories_burnt} kcal
                  </span>
                  <span style={{ opacity: 0.6 }}> after {totals.calories_burnt} burnt</span>
                </div>
              )}

              {/* Meal list */}
              <div className="mt-4 space-y-2">
                <p
                  className="text-xs uppercase tracking-widest font-fraunces font-bold mb-2"
                  style={{ color: "var(--ink-light)", opacity: 0.6 }}
                >
                  {entries.length === 1 ? "1 meal logged" : `${entries.length} meals logged`}
                </p>
                {entries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-2 px-3 py-2 rounded-paper"
                    style={{
                      background: "var(--paper-1)",
                      border: "1.5px solid rgba(28,16,6,0.08)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-fraunces font-bold text-xs truncate" style={{ color: "var(--ink)" }}>
                        {entry.meal_name || `Meal ${idx + 1}`}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}>
                        {format(new Date(entry.created_at), "h:mm a")}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {entry.calories      != null && <MacroBadge type="calories" value={entry.calories}      color={user.color} size="sm" />}
                        {entry.protein       != null && <MacroBadge type="protein"  value={entry.protein}       color={user.color} size="sm" />}
                        {entry.fibre         != null && <MacroBadge type="fibre"    value={entry.fibre}         color={user.color} size="sm" />}
                        {entry.calories_burnt != null && (
                          <span
                            className="inline-flex items-center gap-0.5 font-fraunces font-bold"
                            style={{
                              fontSize: "11px", padding: "2px 8px",
                              background: "rgba(212,98,12,0.08)",
                              border: "1.5px solid rgba(212,98,12,0.25)",
                              borderRadius: "3px 7px 4px 6px",
                              color: "var(--burnt-color, #D4620C)",
                            }}
                          >
                            <Flame className="w-2.5 h-2.5" />
                            {entry.calories_burnt}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="flex-shrink-0 mt-0.5 p-1 rounded transition-opacity hover:opacity-70"
                      style={{ color: "var(--ink-light)" }}
                      title="Delete this entry"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : !showForm ? (
            /* Empty state */
            <div className="text-center py-6">
              <p className="text-4xl mb-2 opacity-60">📋</p>
              <p className="text-sm" style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}>
                Nothing logged yet today
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 btn-sticker"
                style={{ background: accentPaper, color: "var(--ink)" }}
              >
                Log now ✦
              </button>
            </div>
          ) : null}

          {/* Inline log form */}
          {showForm && (
            <div
              className={cn("animate-paper-unfold", entries.length > 0 && "mt-5 pt-5")}
              style={{
                transformOrigin: "top",
                borderTop: entries.length > 0 ? "1.5px dashed rgba(28,16,6,0.12)" : "none",
              }}
            >
              <LogForm
                user={user}
                date={date}
                onSuccess={() => setShowForm(false)}
              />
            </div>
          )}
        </div>

        {/* Curled corner */}
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{ zIndex: 5 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M22 22 L0 22 Q22 22 22 0 Z" fill="var(--paper-3)" opacity="0.9" />
            <path d="M22 22 L0 22 Q22 22 22 0 Z" stroke="rgba(28,16,6,0.10)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}
