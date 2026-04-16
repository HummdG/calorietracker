"use client";

import { macroEmoji, macroLabel, type MacroKey } from "@/lib/utils/macros";

interface MetricSelectorProps {
  value: MacroKey;
  onChange: (metric: MacroKey) => void;
}

const metrics: MacroKey[] = ["calories", "protein", "fibre"];

const macroColors: Record<MacroKey, string> = {
  calories: "var(--cal-color, #CC4A18)",
  protein:  "var(--prot-color, #5E3A98)",
  fibre:    "var(--fib-color, #2E7844)",
};

export function MetricSelector({ value, onChange }: MetricSelectorProps) {
  return (
    <div
      className="flex gap-2 p-1"
      style={{
        background: "var(--paper-2)",
        borderRadius: "5px 9px 6px 8px",
        border: "1.5px solid rgba(28,16,6,0.10)",
      }}
    >
      {metrics.map((metric) => {
        const active = value === metric;
        return (
          <button
            key={metric}
            onClick={() => onChange(metric)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 font-fraunces font-bold text-xs transition-all duration-150"
            style={{
              background: active ? "var(--paper-0)" : "transparent",
              color: active ? macroColors[metric] : "var(--ink-light)",
              borderRadius: "3px 7px 4px 6px",
              border: active ? `1.5px solid ${macroColors[metric]}` : "1.5px solid transparent",
              boxShadow: active ? "var(--shadow-xs)" : "none",
              transform: active ? "rotate(-0.5deg)" : "none",
            }}
          >
            <span>{macroEmoji(metric)}</span>
            <span>{macroLabel(metric)}</span>
          </button>
        );
      })}
    </div>
  );
}
