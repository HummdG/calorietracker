"use client";

import { macroEmoji, macroLabel, type MacroKey } from "@/lib/utils/macros";
import { cn } from "@/lib/utils/cn";

interface MetricSelectorProps {
  value: MacroKey;
  onChange: (metric: MacroKey) => void;
}

const metrics: MacroKey[] = ["calories", "protein", "fibre"];

export function MetricSelector({ value, onChange }: MetricSelectorProps) {
  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
      {metrics.map((metric) => (
        <button
          key={metric}
          onClick={() => onChange(metric)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150",
            value === metric
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          <span>{macroEmoji(metric)}</span>
          <span>{macroLabel(metric)}</span>
        </button>
      ))}
    </div>
  );
}
