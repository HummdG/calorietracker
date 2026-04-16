"use client";

import { useState, useTransition } from "react";
import { upsertEntry } from "@/lib/actions/entries";
import type { UserRow, EntryRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";
import { Save, Loader2, Flame } from "lucide-react";

interface LogFormProps {
  user: UserRow;
  date: Date;
  existing?: EntryRow | null;
  onSuccess?: () => void;
}

export function LogForm({ user, date, existing, onSuccess }: LogFormProps) {
  const isHummd = user.color === "hummd";
  const [isPending, startTransition] = useTransition();

  const [values, setValues] = useState({
    calories: existing?.calories?.toString() ?? "",
    protein: existing?.protein?.toString() ?? "",
    fibre: existing?.fibre?.toString() ?? "",
    calories_burnt: existing?.calories_burnt?.toString() ?? "",
  });

  const inputClass = cn(
    "w-full rounded-xl border-2 px-3 py-2.5 text-sm font-semibold bg-white",
    "outline-none transition-all duration-150 placeholder:text-gray-300",
    "focus:shadow-sm",
    isHummd
      ? "border-gray-200 focus:border-hummd-300 focus:ring-2 focus:ring-hummd-100"
      : "border-gray-200 focus:border-hafsa-300 focus:ring-2 focus:ring-hafsa-100"
  );

  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1";

  const fields: Array<{
    key: keyof typeof values;
    label: string;
    emoji: string;
    placeholder: string;
    unit: string;
  }> = [
    { key: "calories", label: "Calories", emoji: "🔥", placeholder: "e.g. 1800", unit: "kcal" },
    { key: "protein", label: "Protein", emoji: "🥩", placeholder: "e.g. 130", unit: "g" },
    { key: "fibre", label: "Fibre", emoji: "🥦", placeholder: "e.g. 25", unit: "g" },
    { key: "calories_burnt", label: "Calories Burnt", emoji: "🏃", placeholder: "e.g. 450 (optional)", unit: "kcal" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await upsertEntry(user.id, date, {
        calories: values.calories ? Number(values.calories) : null,
        protein: values.protein ? Number(values.protein) : null,
        fibre: values.fibre ? Number(values.fibre) : null,
        calories_burnt: values.calories_burnt ? Number(values.calories_burnt) : null,
      });
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ key, label, emoji, placeholder, unit }) => (
          <div key={key}>
            <label className={labelClass}>
              {emoji} {label}
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                value={values[key]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className={cn(inputClass, "pr-10")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 font-semibold pointer-events-none">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200",
          "hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100",
          isHummd ? "bg-hummd-500" : "bg-hafsa-500"
        )}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {isPending ? "Saving…" : "Save Entry"}
      </button>
    </form>
  );
}
