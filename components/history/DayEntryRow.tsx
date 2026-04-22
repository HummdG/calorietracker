"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Flame, Pencil, Trash2 } from "lucide-react";
import type { UserRow, EntryRow } from "@/lib/supabase/types";
import { MacroBadge } from "@/components/ui/MacroBadge";
import { deleteEntry } from "@/lib/actions/entries";
import { EditEntryForm } from "./EditEntryForm";

interface DayEntryRowProps {
  user: UserRow;
  entries: EntryRow[];
}

function sumOrNull(entries: EntryRow[], key: "calories" | "protein" | "fibre"): number | null {
  const vals = entries.map((e) => e[key]).filter((v): v is number => v != null);
  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) : null;
}

function latestBurnt(entries: EntryRow[]): number | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    const v = entries[i].calories_burnt;
    if (v != null) return v;
  }
  return null;
}

export function DayEntryRow({ user, entries }: DayEntryRowProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startDeleteTransition] = useTransition();

  const isHummd = user.color === "hummd";
  const accent      = isHummd ? "var(--hummd)"       : "var(--hafsa)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";
  const tilt        = isHummd ? "-0.8deg" : "0.8deg";

  const totals = entries.length > 0 ? {
    calories:       sumOrNull(entries, "calories"),
    protein:        sumOrNull(entries, "protein"),
    fibre:          sumOrNull(entries, "fibre"),
    calories_burnt: latestBurnt(entries),
  } : null;

  const handleDelete = (id: string) => {
    startDeleteTransition(async () => {
      await deleteEntry(id);
    });
  };

  return (
    <div
      className="relative"
      style={{ transform: `rotate(${tilt})`, paddingBottom: "8px", paddingRight: "8px" }}
    >
      {/* Stack layer */}
      <div
        className="absolute inset-0 rounded-paper"
        style={{
          background: "var(--paper-3)",
          transform: `translate(7px, 8px) rotate(${isHummd ? "1.5deg" : "-1.5deg"})`,
          zIndex: 0,
          border: "1.5px solid rgba(28,16,6,0.07)",
        }}
      />

      <div
        className="relative rounded-paper p-4"
        style={{
          background: "var(--paper-0)",
          border: `2px solid rgba(28,16,6,0.12)`,
          boxShadow: "var(--shadow-sm)",
          zIndex: 1,
        }}
      >
        {/* Tape */}
        <div
          className="absolute -top-2 left-5"
          style={{
            width: "40px", height: "12px",
            background: "var(--tape-bg)",
            border: "1px solid var(--tape-border)",
            borderRadius: "2px",
            transform: `rotate(${isHummd ? "-1.5deg" : "1.5deg"})`,
            zIndex: 10,
          }}
        />

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: accentLight,
              border: `2px solid ${accent}`,
              borderRadius: "52% 48% 50% 50% / 50% 48% 52% 50%",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            {user.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-fraunces font-black text-sm mb-2" style={{ color: "var(--ink)" }}>
              {user.name}
              {entries.length > 0 && (
                <span
                  className="ml-2 text-xs font-normal"
                  style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
                >
                  {entries.length === 1 ? "1 meal" : `${entries.length} meals`}
                </span>
              )}
            </p>

            {totals ? (
              <>
                {/* Daily totals */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {totals.calories      != null && <MacroBadge type="calories" value={totals.calories}      color={user.color} size="sm" />}
                  {totals.protein       != null && <MacroBadge type="protein"  value={totals.protein}       color={user.color} size="sm" />}
                  {totals.fibre         != null && <MacroBadge type="fibre"    value={totals.fibre}         color={user.color} size="sm" />}
                  {totals.calories_burnt != null && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-fraunces font-bold px-2 py-0.5"
                      style={{
                        background: "rgba(204,74,24,0.1)",
                        color: "var(--cal-color, #CC4A18)",
                        border: "1px solid rgba(204,74,24,0.2)",
                        borderRadius: "3px 7px 4px 6px",
                      }}
                    >
                      <Flame className="w-3 h-3" />
                      {totals.calories_burnt} burnt
                    </span>
                  )}
                </div>

                {/* Individual entry list */}
                <div className="space-y-2">
                  {entries.map((entry, idx) => (
                    <div key={entry.id}>
                      <div
                        className="flex items-start gap-2 px-3 py-2 rounded-paper"
                        style={{
                          background: editingId === entry.id ? accentPaper : "var(--paper-1)",
                          border: editingId === entry.id
                            ? `1.5px solid ${accent}`
                            : "1.5px solid rgba(28,16,6,0.08)",
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

                        {/* Edit / delete buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                          <button
                            onClick={() => setEditingId(editingId === entry.id ? null : entry.id)}
                            className="p-1 rounded transition-opacity hover:opacity-70"
                            style={{ color: editingId === entry.id ? accent : "var(--ink-light)" }}
                            title="Edit entry"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1 rounded transition-opacity hover:opacity-70"
                            style={{ color: "var(--ink-light)" }}
                            title="Delete entry"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Inline edit form */}
                      {editingId === entry.id && (
                        <div className="px-3 pb-3" style={{ background: accentPaper, border: `1.5px solid ${accent}`, borderTop: "none", borderRadius: "0 0 6px 6px" }}>
                          <EditEntryForm
                            entry={entry}
                            user={user}
                            onSuccess={() => setEditingId(null)}
                            onCancel={() => setEditingId(null)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs italic" style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}>
                No entry logged
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
