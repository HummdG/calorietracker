import { cn } from "@/lib/utils/cn";
import { macroEmoji, macroUnit, type MacroKey } from "@/lib/utils/macros";

interface MacroBadgeProps {
  type: MacroKey;
  value: number | null;
  color: string;
  size?: "sm" | "md";
  className?: string;
}

const colorBadge: Record<string, string> = {
  hummd: "bg-hummd-100 text-hummd-700",
  hafsa: "bg-hafsa-100 text-hafsa-700",
};

export function MacroBadge({
  type,
  value,
  color,
  size = "md",
  className,
}: MacroBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        colorBadge[color] ?? "bg-gray-100 text-gray-700",
        className
      )}
    >
      <span>{macroEmoji(type)}</span>
      <span>
        {value != null ? value : "—"}
        {value != null ? macroUnit(type) : ""}
      </span>
    </span>
  );
}
