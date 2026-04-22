"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import { updateEntry } from "@/lib/actions/entries";
import type { EntryRow, UserRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

interface EditEntryFormProps {
  entry: EntryRow;
  user: UserRow;
  onSuccess: () => void;
  onCancel: () => void;
}

const macroFields = [
  { key: "calories"       as const, label: "Calories",   emoji: "🔥", unit: "kcal", color: "var(--cal-color, #CC4A18)" },
  { key: "protein"        as const, label: "Protein",    emoji: "🥩", unit: "g",    color: "var(--prot-color, #5E3A98)" },
  { key: "fibre"          as const, label: "Fibre",      emoji: "🥦", unit: "g",    color: "var(--fib-color, #2E7844)" },
  { key: "calories_burnt" as const, label: "Cals Burnt", emoji: "🏃", unit: "kcal", color: "var(--burnt-color, #D4620C)" },
] as const;

export function EditEntryForm({ entry, user, onSuccess, onCancel }: EditEntryFormProps) {
  const isHummd = user.color === "hummd";
  const [isPending, startTransition] = useTransition();
  const [mealName, setMealName] = useState(entry.meal_name ?? "");
  const [values, setValues] = useState({
    calories:       entry.calories?.toString()       ?? "",
    protein:        entry.protein?.toString()        ?? "",
    fibre:          entry.fibre?.toString()          ?? "",
    calories_burnt: entry.calories_burnt?.toString() ?? "",
  });

  const accent      = isHummd ? "var(--hummd)"       : "var(--hafsa)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";

  const inputStyle = {
    background: "var(--paper-0)",
    border: "none",
    borderBottom: "2px solid rgba(28,16,6,0.15)",
    borderRadius: "3px 5px 0 0",
    color: "var(--ink)",
    outline: "none",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateEntry(entry.id, {
        meal_name:      mealName.trim() || null,
        calories:       values.calories       ? Number(values.calories)       : null,
        protein:        values.protein        ? Number(values.protein)        : null,
        fibre:          values.fibre          ? Number(values.fibre)          : null,
        calories_burnt: values.calories_burnt ? Number(values.calories_burnt) : null,
      });
      onSuccess();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-3 mt-2" style={{ borderTop: "1.5px dashed rgba(28,16,6,0.12)" }}>
      <p className="font-fraunces font-bold text-xs uppercase tracking-widest" style={{ color: "var(--ink-light)", opacity: 0.6 }}>
        Edit entry
      </p>

      {/* Meal name */}
      <div>
        <label className="font-fraunces font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--ink-mid)" }}>
          Meal name{" "}
          <span style={{ opacity: 0.45, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
        </label>
        <input
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          placeholder="e.g. Breakfast, Lunch, Snack…"
          className={cn("w-full px-3 py-2 font-kalam text-sm mt-1", "placeholder:opacity-30")}
          style={inputStyle}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderBottomColor = accent; }}
          onBlur={(e)  => { (e.target as HTMLInputElement).style.borderBottomColor = "rgba(28,16,6,0.15)"; }}
        />
      </div>

      {/* Macro fields */}
      <div className="grid grid-cols-2 gap-2">
        {macroFields.map(({ key, label, emoji, unit, color }) => (
          <div key={key} className="relative">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm">{emoji}</span>
              <label className="font-fraunces font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--ink-mid)" }}>
                {label}
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                value={values[key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder="—"
                className={cn("w-full px-3 py-2.5 pr-10 font-kalam text-sm font-bold transition-all duration-150", "placeholder:opacity-30")}
                style={{ ...inputStyle, borderBottom: `2px solid ${color}` }}
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

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 font-fraunces font-black text-sm transition-all duration-150 disabled:opacity-60"
          style={{
            background: accentPaper,
            color: "var(--ink)",
            border: `2.5px solid ${accent}`,
            borderRadius: "5px 11px 7px 9px",
            padding: "8px 16px",
            boxShadow: isPending
              ? `1px 1px 0 var(--ink-mid)`
              : `3px 3px 0 var(--ink), 2px 5px 10px rgba(28,16,6,0.18)`,
            transform: isPending ? "translate(2px, 2px)" : "rotate(-0.3deg)",
          }}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Save changes ✦
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="font-fraunces font-bold text-sm px-4 transition-all duration-150 hover:opacity-70"
          style={{
            background: "var(--paper-1)",
            color: "var(--ink-mid)",
            border: "2px solid rgba(28,16,6,0.15)",
            borderRadius: "5px 9px 6px 8px",
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
