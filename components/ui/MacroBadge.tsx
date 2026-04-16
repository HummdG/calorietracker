import { macroEmoji, macroUnit, type MacroKey } from "@/lib/utils/macros";

interface MacroBadgeProps {
  type: MacroKey;
  value: number | null;
  color: string;
  size?: "sm" | "md";
  className?: string;
}

const macroBorderColors: Record<MacroKey, string> = {
  calories: "rgba(204,74,24,0.25)",
  protein:  "rgba(94,58,152,0.25)",
  fibre:    "rgba(46,120,68,0.25)",
};

const macroBgColors: Record<MacroKey, string> = {
  calories: "rgba(204,74,24,0.08)",
  protein:  "rgba(94,58,152,0.08)",
  fibre:    "rgba(46,120,68,0.08)",
};

const macroTextColors: Record<MacroKey, string> = {
  calories: "var(--cal-color, #CC4A18)",
  protein:  "var(--prot-color, #5E3A98)",
  fibre:    "var(--fib-color, #2E7844)",
};

export function MacroBadge({ type, value, size = "md" }: MacroBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 font-fraunces font-bold"
      style={{
        fontSize: size === "sm" ? "11px" : "13px",
        padding: size === "sm" ? "2px 8px" : "4px 12px",
        background: macroBgColors[type],
        border: `1.5px solid ${macroBorderColors[type]}`,
        borderRadius: "3px 7px 4px 6px",
        color: macroTextColors[type],
      }}
    >
      <span>{macroEmoji(type)}</span>
      <span>
        {value != null ? value : "—"}
        {value != null ? macroUnit(type) : ""}
      </span>
    </span>
  );
}
