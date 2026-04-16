"use client";

import { useState, useTransition } from "react";
import { upsertEntry } from "@/lib/actions/entries";
import type { UserRow, EntryRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";
import { Save, Loader2 } from "lucide-react";

interface LogFormProps {
  user: UserRow;
  date: Date;
  existing?: EntryRow | null;
  onSuccess?: () => void;
}

const fields = [
  { key: "calories"      as const, label: "Calories",      emoji: "🔥", unit: "kcal", color: "var(--cal-color, #CC4A18)" },
  { key: "protein"       as const, label: "Protein",       emoji: "🥩", unit: "g",    color: "var(--prot-color, #5E3A98)" },
  { key: "fibre"         as const, label: "Fibre",         emoji: "🥦", unit: "g",    color: "var(--fib-color, #2E7844)" },
  { key: "calories_burnt" as const, label: "Calories Burnt", emoji: "🏃", unit: "kcal", color: "var(--burnt-color, #D4620C)" },
] as const;

export function LogForm({ user, date, existing, onSuccess }: LogFormProps) {
  const isHummd = user.color === "hummd";
  const [isPending, startTransition] = useTransition();

  const [values, setValues] = useState({
    calories:       existing?.calories?.toString()       ?? "",
    protein:        existing?.protein?.toString()        ?? "",
    fibre:          existing?.fibre?.toString()          ?? "",
    calories_burnt: existing?.calories_burnt?.toString() ?? "",
  });

  const accent      = isHummd ? "var(--hummd)"       : "var(--hafsa)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await upsertEntry(user.id, date, {
        calories:       values.calories       ? Number(values.calories)       : null,
        protein:        values.protein        ? Number(values.protein)        : null,
        fibre:          values.fibre          ? Number(values.fibre)          : null,
        calories_burnt: values.calories_burnt ? Number(values.calories_burnt) : null,
      });
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      {/* Notepad header */}
      <div
        className="text-center mb-3 pb-2"
        style={{
          borderBottom: "1.5px dashed rgba(28,16,6,0.15)",
        }}
      >
        <p
          className="font-fraunces font-bold text-xs uppercase tracking-widest"
          style={{ color: "var(--ink-light)" }}
        >
          fill in today&apos;s numbers
        </p>
      </div>

      {/* Fields — look like form fields on a printed paper form */}
      <div className="grid grid-cols-2 gap-2">
        {fields.map(({ key, label, emoji, unit, color }) => (
          <div key={key} className="relative">
            {/* Label strip — like a printed label on the form */}
            <div
              className="flex items-center gap-1 mb-1"
            >
              <span className="text-sm">{emoji}</span>
              <label
                className="font-fraunces font-semibold text-xs uppercase tracking-wide"
                style={{ color: "var(--ink-mid)" }}
              >
                {label}
              </label>
            </div>

            {/* Input — looks like writing on paper */}
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                value={values[key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder="—"
                className={cn(
                  "w-full px-3 py-2.5 pr-10 font-kalam text-sm font-bold transition-all duration-150",
                  "placeholder:opacity-30"
                )}
                style={{
                  background: "var(--paper-0)",
                  border: "none",
                  borderBottom: `2px solid ${color}`,
                  borderRadius: "3px 5px 0 0",
                  color: "var(--ink)",
                  outline: "none",
                  boxShadow: "inset 0 -1px 0 transparent",
                  // Lined paper effect
                  backgroundImage: `repeating-linear-gradient(
                    transparent, transparent 27px,
                    rgba(100,140,200,0.10) 27px, rgba(100,140,200,0.10) 28px
                  )`,
                  backgroundSize: "100% 28px",
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.boxShadow = `inset 0 -2px 0 ${color}`;
                  (e.target as HTMLInputElement).style.background = accentLight;
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                  (e.target as HTMLInputElement).style.background = "var(--paper-0)";
                }}
              />
              <span
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-kalam pointer-events-none opacity-40"
                style={{ color: "var(--ink)" }}
              >
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Submit — stamp-style button */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-full font-fraunces font-black text-sm transition-all duration-150 disabled:opacity-60"
          style={{
            background: accentPaper,
            color: "var(--ink)",
            border: `2.5px solid ${accent}`,
            borderRadius: "5px 11px 7px 9px",
            padding: "11px 20px",
            boxShadow: isPending
              ? `1px 1px 0 var(--ink-mid)`
              : `3px 3px 0 var(--ink), 2px 5px 10px rgba(28,16,6,0.18)`,
            transform: isPending ? "translate(2px, 2px) rotate(0deg)" : "rotate(-0.3deg)",
            letterSpacing: "0.02em",
          }}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Save Entry ✦
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
