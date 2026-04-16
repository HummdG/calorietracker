"use client";

import { useState, useTransition } from "react";
import { addEntry } from "@/lib/actions/entries";
import type { UserRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";
import { Plus, Loader2 } from "lucide-react";

interface LogFormProps {
  user: UserRow;
  date: Date;
  onSuccess?: () => void;
}

const macroFields = [
  { key: "calories"       as const, label: "Calories",      emoji: "🔥", unit: "kcal", color: "var(--cal-color, #CC4A18)" },
  { key: "protein"        as const, label: "Protein",       emoji: "🥩", unit: "g",    color: "var(--prot-color, #5E3A98)" },
  { key: "fibre"          as const, label: "Fibre",         emoji: "🥦", unit: "g",    color: "var(--fib-color, #2E7844)" },
  { key: "calories_burnt" as const, label: "Cals Burnt",    emoji: "🏃", unit: "kcal", color: "var(--burnt-color, #D4620C)" },
] as const;

const emptyValues = { calories: "", protein: "", fibre: "", calories_burnt: "" };

export function LogForm({ user, date, onSuccess }: LogFormProps) {
  const isHummd = user.color === "hummd";
  const [isPending, startTransition] = useTransition();
  const [mealName, setMealName] = useState("");
  const [values, setValues] = useState(emptyValues);

  const accent      = isHummd ? "var(--hummd)"       : "var(--hafsa)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";

  const inputStyle = {
    background: "var(--paper-0)",
    border: "none",
    borderBottom: "2px solid rgba(28,16,6,0.15)",
    borderRadius: "3px 5px 0 0",
    color: "var(--ink)",
    outline: "none",
    backgroundImage: `repeating-linear-gradient(
      transparent, transparent 27px,
      rgba(100,140,200,0.10) 27px, rgba(100,140,200,0.10) 28px
    )`,
    backgroundSize: "100% 28px",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await addEntry(user.id, date, {
        meal_name:      mealName.trim() || null,
        calories:       values.calories       ? Number(values.calories)       : null,
        protein:        values.protein        ? Number(values.protein)        : null,
        fibre:          values.fibre          ? Number(values.fibre)          : null,
        calories_burnt: values.calories_burnt ? Number(values.calories_burnt) : null,
      });
      setMealName("");
      setValues(emptyValues);
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Meal name — optional */}
      <div>
        <label
          className="font-fraunces font-semibold text-xs uppercase tracking-wide"
          style={{ color: "var(--ink-mid)" }}
        >
          Meal name <span style={{ opacity: 0.45, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
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
              <label
                className="font-fraunces font-semibold text-xs uppercase tracking-wide"
                style={{ color: "var(--ink-mid)" }}
              >
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
                className={cn(
                  "w-full px-3 py-2.5 pr-10 font-kalam text-sm font-bold transition-all duration-150",
                  "placeholder:opacity-30"
                )}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full font-fraunces font-black text-sm transition-all duration-150 disabled:opacity-60"
        style={{
          background: accentPaper,
          color: "var(--ink)",
          border: `2.5px solid ${accent}`,
          borderRadius: "5px 11px 7px 9px",
          padding: "10px 20px",
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
            Adding…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Entry ✦
          </span>
        )}
      </button>
    </form>
  );
}
