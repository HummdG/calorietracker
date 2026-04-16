"use client";

import { useState, useTransition } from "react";
import { upsertGoals } from "@/lib/actions/goals";
import type { UserRow, GoalsRow } from "@/lib/supabase/types";
import { EmojiAvatar } from "@/components/ui/EmojiAvatar";
import { cn } from "@/lib/utils/cn";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

interface GoalFormProps {
  user: UserRow;
  goals: GoalsRow | null;
}

export function GoalForm({ user, goals }: GoalFormProps) {
  const isHummd = user.color === "hummd";
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [values, setValues] = useState({
    calories_target: goals?.calories_target?.toString() ?? "2000",
    protein_target: goals?.protein_target?.toString() ?? "150",
    fibre_target: goals?.fibre_target?.toString() ?? "30",
  });

  const inputClass = cn(
    "w-full rounded-xl border-2 px-3 py-2.5 text-sm font-semibold bg-white outline-none transition-all duration-150",
    "focus:shadow-sm",
    isHummd
      ? "border-gray-200 focus:border-hummd-300 focus:ring-2 focus:ring-hummd-100"
      : "border-gray-200 focus:border-hafsa-300 focus:ring-2 focus:ring-hafsa-100"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    startTransition(async () => {
      await upsertGoals(user.id, {
        calories_target: Number(values.calories_target),
        protein_target: Number(values.protein_target),
        fibre_target: Number(values.fibre_target),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const fields = [
    { key: "calories_target" as const, label: "Calories Goal", emoji: "🔥", unit: "kcal" },
    { key: "protein_target" as const, label: "Protein Goal", emoji: "🥩", unit: "g" },
    { key: "fibre_target" as const, label: "Fibre Goal", emoji: "🥦", unit: "g" },
  ];

  return (
    <div
      className={cn(
        "rounded-3xl border-2 bg-white shadow-sm p-5",
        isHummd ? "border-hummd-100" : "border-hafsa-100"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-3 mb-5 pb-4 border-b",
          isHummd ? "border-hummd-100" : "border-hafsa-100"
        )}
      >
        <EmojiAvatar emoji={user.emoji} color={user.color} size="md" />
        <div>
          <h3
            className={cn(
              "font-extrabold",
              isHummd ? "text-hummd-700" : "text-hafsa-700"
            )}
          >
            {user.name}&apos;s Goals
          </h3>
          <p className="text-xs text-gray-400">Daily nutrition targets</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {fields.map(({ key, label, emoji, unit }) => (
          <div key={key}>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              {emoji} {label}
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={values[key]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className={cn(inputClass, "pr-12")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 font-semibold pointer-events-none">
                {unit}
              </span>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 mt-2",
            "hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100",
            saved ? "bg-green-500" : isHummd ? "bg-hummd-500" : "bg-hafsa-500"
          )}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isPending ? "Saving…" : saved ? "Saved!" : "Save Goals"}
        </button>
      </form>
    </div>
  );
}
