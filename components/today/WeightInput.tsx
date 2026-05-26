"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Scale } from "lucide-react";
import type { UserRow } from "@/lib/supabase/types";
import { upsertWeight } from "@/lib/actions/weights";

interface WeightInputProps {
  user: UserRow;
  date: Date;
  initialWeight: number | null;
}

export function WeightInput({ user, date, initialWeight }: WeightInputProps) {
  const isHummd = user.color === "hummd";
  const accent = isHummd ? "var(--hummd)" : "var(--hafsa)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";

  const [value, setValue] = useState(initialWeight != null ? String(initialWeight) : "");
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  // Re-sync local state if the server-side initial value changes (e.g. after revalidation).
  useEffect(() => {
    setValue(initialWeight != null ? String(initialWeight) : "");
  }, [initialWeight]);

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed === "") return;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    if (initialWeight != null && Math.abs(parsed - initialWeight) < 1e-9) return;

    startTransition(async () => {
      await upsertWeight(user.id, date, parsed);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      setJustSaved(true);
      savedTimer.current = setTimeout(() => setJustSaved(false), 800);
    });
  };

  return (
    <div
      className="flex items-center justify-between gap-3 mb-4 px-3 py-2"
      style={{
        background: "var(--paper-1)",
        border: "1.5px dashed rgba(28,16,6,0.12)",
        borderRadius: "5px 9px 6px 8px",
      }}
    >
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4" style={{ color: accent, opacity: 0.85 }} />
        <span
          className="font-fraunces font-semibold text-xs uppercase tracking-wide"
          style={{ color: "var(--ink-mid)" }}
        >
          Weight today
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={0.1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder="—"
          disabled={isPending}
          className="w-16 text-right font-kalam font-bold text-sm placeholder:opacity-30"
          style={{
            background: "transparent",
            border: "none",
            borderBottom: `2px solid ${accent}`,
            color: "var(--ink)",
            outline: "none",
            padding: "2px 4px",
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.background = accentLight;
          }}
          onBlurCapture={(e) => {
            (e.target as HTMLInputElement).style.background = "transparent";
          }}
        />
        <span
          className="font-kalam text-xs"
          style={{ color: "var(--ink-light)", opacity: 0.7 }}
        >
          kg
        </span>
        <span
          className="ml-1 w-4 h-4 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: justSaved ? 1 : 0, color: accent }}
          aria-hidden={!justSaved}
        >
          <Check className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
