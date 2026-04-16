import type { UserRow, EntryRow } from "@/lib/supabase/types";
import { MacroBadge } from "@/components/ui/MacroBadge";
import { Flame } from "lucide-react";

interface DayEntryRowProps {
  user: UserRow;
  entry: EntryRow | null;
}

export function DayEntryRow({ user, entry }: DayEntryRowProps) {
  const isHummd = user.color === "hummd";
  const accent      = isHummd ? "var(--hummd)"       : "var(--hafsa)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";
  const tilt        = isHummd ? "-0.8deg" : "0.8deg";

  return (
    <div
      className="relative"
      style={{
        transform: `rotate(${tilt})`,
        paddingBottom: "8px",
        paddingRight: "8px",
      }}
    >
      {/* Stack layer */}
      <div
        className="absolute inset-0 rounded-paper"
        style={{
          background: "var(--paper-3)",
          transform: `translate(7px, 8px) rotate(${isHummd ? "1.5deg" : "-1.5deg"})`,
          zIndex: 0,
          border: "1.5px solid rgba(28,16,6,0.07)",
        }}
      />

      <div
        className="relative rounded-paper p-4"
        style={{
          background: "var(--paper-0)",
          border: `2px solid rgba(28,16,6,0.12)`,
          boxShadow: "var(--shadow-sm)",
          zIndex: 1,
        }}
      >
        {/* Tape */}
        <div
          className="absolute -top-2 left-5"
          style={{
            width: "40px",
            height: "12px",
            background: "var(--tape-bg)",
            border: "1px solid var(--tape-border)",
            borderRadius: "2px",
            transform: `rotate(${isHummd ? "-1.5deg" : "1.5deg"})`,
            zIndex: 10,
          }}
        />

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: accentLight,
              border: `2px solid ${accent}`,
              borderRadius: "52% 48% 50% 50% / 50% 48% 52% 50%",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            {user.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-fraunces font-black text-sm mb-2"
              style={{ color: "var(--ink)" }}
            >
              {user.name}
            </p>

            {entry ? (
              <div className="flex flex-wrap gap-1.5">
                {entry.calories != null && <MacroBadge type="calories" value={entry.calories} color={user.color} size="sm" />}
                {entry.protein  != null && <MacroBadge type="protein"  value={entry.protein}  color={user.color} size="sm" />}
                {entry.fibre    != null && <MacroBadge type="fibre"    value={entry.fibre}    color={user.color} size="sm" />}
                {entry.calories_burnt != null && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-fraunces font-bold px-2 py-0.5"
                    style={{
                      background: "rgba(204,74,24,0.1)",
                      color: "var(--cal-color, #CC4A18)",
                      border: "1px solid rgba(204,74,24,0.2)",
                      borderRadius: "3px 7px 4px 6px",
                    }}
                  >
                    <Flame className="w-3 h-3" />
                    {entry.calories_burnt} burnt
                  </span>
                )}
              </div>
            ) : (
              <p
                className="text-xs italic"
                style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
              >
                No entry logged
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
