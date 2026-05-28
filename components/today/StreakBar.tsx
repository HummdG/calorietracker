"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { resetLockIn } from "@/lib/actions/streak";

interface StreakBarProps {
  currentDay: number;
  target: number;
  reward: boolean;
  startDate: string;
}

export function StreakBar({ currentDay, target, reward, startDate }: StreakBarProps) {
  const [isResetting, startResetTransition] = useTransition();
  const fillPct = Math.min(currentDay / target, 1) * 100;
  const ticks = Array.from({ length: target - 1 }, (_, i) => ((i + 1) / target) * 100);
  const startLabel = format(parseISO(startDate), "EEE d MMM");

  const handleReset = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        reward
          ? "Snack claimed? Start a fresh 30-day lock-in from today?"
          : `Reset the lock-in? Day 1 will become today (currently on day ${currentDay}).`
      );
      if (!confirmed) return;
    }
    startResetTransition(async () => {
      await resetLockIn();
    });
  };

  return (
    <div
      className="mb-8 animate-paper-drop"
      style={{ "--card-tilt": "-0.4deg", animationDelay: "0.05s" } as React.CSSProperties}
    >
      <div className="relative" style={{ transform: "rotate(-0.4deg)" }}>
        {/* Tape — top-left */}
        <div
          className="absolute -top-2.5 left-10 z-10"
          style={{
            width: "48px",
            height: "14px",
            background: "var(--tape-bg)",
            border: "1px solid var(--tape-border)",
            borderRadius: "2px",
            transform: "rotate(-3deg)",
            boxShadow: "0 1px 3px rgba(28,16,6,0.10)",
          }}
        />
        {/* Tape — top-right */}
        <div
          className="absolute -top-2.5 right-10 z-10"
          style={{
            width: "48px",
            height: "14px",
            background: "var(--tape-bg)",
            border: "1px solid var(--tape-border)",
            borderRadius: "2px",
            transform: "rotate(2deg)",
            boxShadow: "0 1px 3px rgba(28,16,6,0.10)",
          }}
        />

        <div
          className="relative px-5 py-4 rounded-paper"
          style={{
            background: "var(--paper-0)",
            border: "2px solid rgba(28,16,6,0.13)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Headline row */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{reward ? "🍪" : "🔒"}</span>
              <h2
                className="font-fraunces font-black text-lg leading-none"
                style={{ color: "var(--ink)", letterSpacing: "0.01em" }}
              >
                {reward ? "Locked In — Snack Earned!" : "30-Day Lock In"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="font-fraunces font-black text-base"
                style={{ color: reward ? "#C9852C" : "var(--ink-mid)" }}
              >
                Day {currentDay} <span style={{ opacity: 0.5, fontWeight: 700 }}>/ {target}</span>
              </div>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="flex items-center justify-center w-7 h-7 transition-all duration-150 hover:-rotate-12 disabled:opacity-50"
                style={{
                  background: "var(--paper-2)",
                  border: "1.5px solid rgba(28,16,6,0.18)",
                  borderRadius: "5px 8px 6px 7px",
                  boxShadow: "var(--shadow-xs)",
                  color: "var(--ink-mid)",
                }}
                title={reward ? "Claim snack and reset to day 1" : "Reset to day 1"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bar */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              height: "18px",
              background: "var(--paper-2)",
              border: "1.5px solid rgba(28,16,6,0.18)",
              borderRadius: "5px 9px 6px 8px",
            }}
          >
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${fillPct}%`,
                background: reward
                  ? "linear-gradient(90deg, #C9852C, #E0A444)"
                  : "linear-gradient(90deg, var(--ink-mid), #C9852C)",
                borderRight: fillPct > 0 && fillPct < 100 ? "1.5px solid rgba(28,16,6,0.22)" : "none",
                boxShadow: reward ? "inset 0 0 8px rgba(255,255,255,0.35)" : "none",
              }}
            />
            {ticks.map((pct) => (
              <span
                key={pct}
                className="absolute top-0 bottom-0 pointer-events-none"
                style={{
                  left: `${pct}%`,
                  width: "1px",
                  background: "rgba(28,16,6,0.12)",
                }}
              />
            ))}
          </div>

          {/* Caption */}
          <p
            className="mt-2 text-xs"
            style={{
              color: "var(--ink-light)",
              fontFamily: "var(--font-kalam)",
              opacity: 0.75,
            }}
          >
            {reward
              ? `Day ${currentDay} since ${startLabel} — snack time ✦`
              : `Started ${startLabel} — keep going, ${target - currentDay} day${target - currentDay === 1 ? "" : "s"} to snack`}
          </p>
        </div>
      </div>
    </div>
  );
}
