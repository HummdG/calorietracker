"use client";

import { useState, useTransition } from "react";
import { upsertGoals } from "@/lib/actions/goals";
import type { UserRow, GoalsRow } from "@/lib/supabase/types";
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
    protein_target:  goals?.protein_target?.toString()  ?? "150",
    fibre_target:    goals?.fibre_target?.toString()    ?? "30",
  });

  const accent      = isHummd ? "var(--hummd)"       : "var(--hafsa)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";
  const tilt        = isHummd ? "-1deg" : "1deg";

  const fields = [
    { key: "calories_target" as const, label: "Calories Goal", emoji: "🔥", unit: "kcal", color: "var(--cal-color, #CC4A18)" },
    { key: "protein_target"  as const, label: "Protein Goal",  emoji: "🥩", unit: "g",    color: "var(--prot-color, #5E3A98)" },
    { key: "fibre_target"    as const, label: "Fibre Goal",    emoji: "🥦", unit: "g",    color: "var(--fib-color, #2E7844)" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    startTransition(async () => {
      await upsertGoals(user.id, {
        calories_target: Number(values.calories_target),
        protein_target:  Number(values.protein_target),
        fibre_target:    Number(values.fibre_target),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  return (
    <div
      className="relative"
      style={{
        transform: `rotate(${tilt})`,
        paddingBottom: "12px",
        paddingRight: "12px",
      }}
    >
      {/* Stack layers */}
      <div
        className="absolute inset-0 rounded-paper"
        style={{
          background: "var(--paper-3)",
          transform: `translate(10px, 12px) rotate(${isHummd ? "2.5deg" : "-2.5deg"})`,
          border: "1.5px solid rgba(28,16,6,0.07)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute inset-0 rounded-paper"
        style={{
          background: "var(--paper-2)",
          transform: `translate(5px, 6px) rotate(${isHummd ? "1.2deg" : "-1.2deg"})`,
          border: "1.5px solid rgba(28,16,6,0.09)",
          zIndex: 1,
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative rounded-paper overflow-visible"
        style={{
          background: "var(--paper-0)",
          border: "2px solid rgba(28,16,6,0.12)",
          boxShadow: "var(--shadow-card)",
          zIndex: 2,
        }}
      >
        {/* Tape */}
        <div
          className="absolute -top-3 left-1/2"
          style={{
            transform: `translateX(-50%) rotate(${isHummd ? "-2deg" : "2deg"})`,
            width: "58px",
            height: "15px",
            background: "var(--tape-bg)",
            border: "1px solid var(--tape-border)",
            borderRadius: "2px",
            zIndex: 10,
            boxShadow: "0 1px 3px rgba(28,16,6,0.10)",
          }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{
            background: accentPaper,
            borderBottom: `2px solid ${accent}`,
            borderRadius: "3px 7px 0 0",
          }}
        >
          <div
            className="w-10 h-10 flex items-center justify-center text-2xl rounded-full flex-shrink-0"
            style={{
              background: accentLight,
              border: `2px solid ${accent}`,
              borderRadius: "52% 48% 50% 50% / 50% 48% 52% 50%",
            }}
          >
            {user.emoji}
          </div>
          <div>
            <h3
              className="font-fraunces font-black text-lg leading-tight"
              style={{ color: "var(--ink)" }}
            >
              {user.name}&apos;s Goals
            </h3>
            <p className="text-xs" style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}>
              daily nutrition targets
            </p>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {fields.map(({ key, label, emoji, unit, color }) => (
            <div key={key}>
              <label
                className="flex items-center gap-1.5 font-fraunces font-semibold text-xs uppercase tracking-wide mb-1"
                style={{ color: "var(--ink-mid)" }}
              >
                <span>{emoji}</span> {label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={values[key]}
                  onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5 pr-12 font-kalam font-bold text-sm transition-all duration-150"
                  style={{
                    background: "var(--paper-0)",
                    border: "none",
                    borderBottom: `2px solid ${color}`,
                    borderRadius: "3px 5px 0 0",
                    color: "var(--ink)",
                    outline: "none",
                  }}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
                  style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
                >
                  {unit}
                </span>
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full font-fraunces font-black text-sm transition-all duration-150 disabled:opacity-60"
              style={{
                background: saved ? "rgba(46,120,68,0.15)" : accentPaper,
                color: saved ? "var(--fib-color, #2E7844)" : "var(--ink)",
                border: saved ? "2.5px solid var(--fib-color, #2E7844)" : `2.5px solid ${accent}`,
                borderRadius: "5px 11px 7px 9px",
                padding: "11px 20px",
                boxShadow: isPending
                  ? "1px 1px 0 rgba(28,16,6,0.2)"
                  : "3px 3px 0 rgba(28,16,6,0.2), 2px 5px 10px rgba(28,16,6,0.12)",
                transform: isPending ? "translate(2px,2px)" : "rotate(-0.3deg)",
              }}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                </span>
              ) : saved ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Saved! ✦
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save Goals ✦
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Curled corner */}
        <div className="absolute bottom-0 right-0 pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M22 22 L0 22 Q22 22 22 0 Z" fill="var(--paper-3)" opacity="0.85" />
            <path d="M22 22 L0 22 Q22 22 22 0 Z" stroke="rgba(28,16,6,0.08)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </form>
    </div>
  );
}
