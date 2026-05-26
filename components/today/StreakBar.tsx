"use client";

interface StreakBarProps {
  streak: number;
  target: number;
  reward: boolean;
  bothLoggedToday: boolean;
}

export function StreakBar({ streak, target, reward, bothLoggedToday }: StreakBarProps) {
  const fillPct = Math.min(streak / target, 1) * 100;
  const ticks = Array.from({ length: target - 1 }, (_, i) => ((i + 1) / target) * 100);

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
              <span className="text-xl" style={{ filter: reward ? "none" : "grayscale(0)" }}>
                {reward ? "🍪" : "🔒"}
              </span>
              <h2
                className="font-fraunces font-black text-lg leading-none"
                style={{ color: "var(--ink)", letterSpacing: "0.01em" }}
              >
                {reward ? "Locked In — Snack Earned!" : "30-Day Lock In"}
              </h2>
            </div>
            <div
              className="font-fraunces font-black text-base"
              style={{ color: reward ? "#C9852C" : "var(--ink-mid)" }}
            >
              {streak} <span style={{ opacity: 0.5, fontWeight: 700 }}>/ {target}</span>
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
            {/* Tick marks every day */}
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
              ? `On a ${streak}-day streak. Don't break it now ✦`
              : bothLoggedToday
                ? "Both logged today — keep it rolling."
                : "Today still pending — log something to keep the streak alive."}
          </p>
        </div>
      </div>
    </div>
  );
}
