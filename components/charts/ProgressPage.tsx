"use client";

import { useState } from "react";
import type { UserRow, EntryRow, GoalsRow } from "@/lib/supabase/types";
import { WeeklyTrendChart } from "./WeeklyTrendChart";
import { CaloriesBurntBar } from "./CaloriesBurntBar";
import { MetricSelector } from "./MetricSelector";
import type { MacroKey } from "@/lib/utils/macros";
import { macroEmoji, macroLabel, macroUnit } from "@/lib/utils/macros";

interface ProgressPageProps {
  users: UserRow[];
  entries: EntryRow[];
  goals: GoalsRow[];
  days: string[];
}

export function ProgressPage({ users, entries, goals, days }: ProgressPageProps) {
  const [metric, setMetric] = useState<MacroKey>("calories");

  const hummd = users.find((u) => u.color === "hummd");
  const hafsa = users.find((u) => u.color === "hafsa");

  const hummdGoals = goals.find((g) => g.user_id === hummd?.id);
  const hafsaGoals = goals.find((g) => g.user_id === hafsa?.id);

  function sumForDay(userId: string, date: string, key: MacroKey): number | null {
    const vals = entries
      .filter((e) => e.user_id === userId && e.date === date)
      .map((e) => e[key])
      .filter((v): v is number => v != null);
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) : null;
  }

  // Calories burnt is a status update — use only the most recent entry per day
  function latestBurntForDay(userId: string, date: string): number | null {
    const dayEntries = entries.filter((e) => e.user_id === userId && e.date === date);
    for (let i = dayEntries.length - 1; i >= 0; i--) {
      const v = dayEntries[i].calories_burnt;
      if (v != null) return v;
    }
    return null;
  }

  const chartData = days.map((date) => ({
    date,
    hummd: hummd ? sumForDay(hummd.id, date, metric) : null,
    hafsa: hafsa ? sumForDay(hafsa.id, date, metric) : null,
  }));

  const burntData = days.map((date) => ({
    date,
    hummd: hummd ? latestBurntForDay(hummd.id, date) : null,
    hafsa: hafsa ? latestBurntForDay(hafsa.id, date) : null,
  }));

  function avg(userId: string, key: MacroKey): string {
    // Average of daily totals (not individual meal entries)
    const dayTotals = days
      .map((date) => sumForDay(userId, date, key))
      .filter((v): v is number => v != null);
    if (!dayTotals.length) return "—";
    return Math.round(dayTotals.reduce((a, b) => a + b, 0) / dayTotals.length).toString();
  }

  function getTarget(userId: string) {
    const g = goals.find((g) => g.user_id === userId);
    if (!g) return undefined;
    return metric === "calories" ? g.calories_target : metric === "protein" ? g.protein_target : g.fibre_target;
  }

  const unit = macroUnit(metric);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div style={{ transform: "rotate(0.4deg)" }}>
        <div
          className="inline-block relative px-6 py-3 rounded-paper"
          style={{
            background: "var(--paper-0)",
            border: "2px solid rgba(28,16,6,0.12)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            className="absolute -top-2.5 left-8"
            style={{
              width: "52px",
              height: "14px",
              background: "var(--tape-bg)",
              border: "1px solid var(--tape-border)",
              borderRadius: "2px",
              transform: "rotate(-2deg)",
            }}
          />
          <h1 className="font-fraunces font-black text-2xl leading-none" style={{ color: "var(--ink)" }}>
            Progress 📈
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}>
            last 7 days
          </p>
        </div>
      </div>

      {/* Avg stat cards */}
      <div className="grid grid-cols-2 gap-6">
        {[hummd, hafsa].map((user, idx) => {
          if (!user) return null;
          const isHummd = user.color === "hummd";
          const avgVal = avg(user.id, metric);
          const target = getTarget(user.id);
          const accent = isHummd ? "var(--hummd)" : "var(--hafsa)";
          const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
          const tilt = isHummd ? "-1deg" : "1deg";
          return (
            <div
              key={user.id}
              className="relative"
              style={{
                transform: `rotate(${tilt})`,
                paddingBottom: "8px",
                paddingRight: "8px",
              }}
            >
              <div
                className="absolute inset-0 rounded-paper"
                style={{
                  background: "var(--paper-3)",
                  transform: `translate(7px, 8px) rotate(${isHummd ? "2deg" : "-2deg"})`,
                  zIndex: 0,
                }}
              />
              <div
                className="relative rounded-paper p-4"
                style={{
                  background: accentPaper,
                  border: `2px solid ${accent}`,
                  boxShadow: "var(--shadow-sm)",
                  zIndex: 1,
                }}
              >
                {/* Tape */}
                <div
                  className="absolute -top-2 left-4"
                  style={{
                    width: "40px",
                    height: "12px",
                    background: "var(--tape-bg)",
                    border: "1px solid var(--tape-border)",
                    borderRadius: "2px",
                    transform: `rotate(${isHummd ? "-2deg" : "2deg"})`,
                    zIndex: 10,
                  }}
                />
                <p
                  className="text-xs font-fraunces font-semibold mb-1"
                  style={{ color: "var(--ink-mid)" }}
                >
                  {user.emoji} {user.name} · 7d avg
                </p>
                <p
                  className="font-fraunces font-black text-3xl leading-tight"
                  style={{ color: "var(--ink)" }}
                >
                  {avgVal}
                  {avgVal !== "—" && (
                    <span className="text-base font-bold ml-1" style={{ color: accent }}>{unit}</span>
                  )}
                </p>
                {target && avgVal !== "—" && (
                  <p className="text-xs mt-1" style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}>
                    goal: {target}{unit}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend chart card */}
      <div
        className="relative"
        style={{ transform: "rotate(-0.4deg)", paddingBottom: "12px", paddingRight: "12px" }}
      >
        <div
          className="absolute inset-0 rounded-paper"
          style={{
            background: "var(--paper-3)",
            transform: "translate(10px, 12px) rotate(1.5deg)",
            zIndex: 0,
          }}
        />
        <div
          className="relative rounded-paper p-5"
          style={{
            background: "var(--paper-0)",
            border: "2px solid rgba(28,16,6,0.12)",
            boxShadow: "var(--shadow-card)",
            zIndex: 1,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-fraunces font-black text-base"
              style={{ color: "var(--ink)" }}
            >
              {macroEmoji(metric)} {macroLabel(metric)} Trend
            </h3>
          </div>
          <MetricSelector value={metric} onChange={setMetric} />
          <div className="mt-4">
            <WeeklyTrendChart
              data={chartData}
              metric={metric}
              hummdTarget={hummd ? getTarget(hummd.id) : undefined}
              hafsaTarget={hafsa ? getTarget(hafsa.id) : undefined}
            />
          </div>
        </div>
      </div>

      {/* Burnt bar chart card */}
      <div
        className="relative"
        style={{ transform: "rotate(0.3deg)", paddingBottom: "12px", paddingRight: "12px" }}
      >
        <div
          className="absolute inset-0 rounded-paper"
          style={{
            background: "var(--paper-3)",
            transform: "translate(10px, 12px) rotate(-1.2deg)",
            zIndex: 0,
          }}
        />
        <div
          className="relative rounded-paper p-5"
          style={{
            background: "var(--paper-0)",
            border: "2px solid rgba(28,16,6,0.12)",
            boxShadow: "var(--shadow-card)",
            zIndex: 1,
          }}
        >
          <h3
            className="font-fraunces font-black text-base mb-4"
            style={{ color: "var(--ink)" }}
          >
            🏃 Calories Burnt
          </h3>
          <CaloriesBurntBar data={burntData} />
        </div>
      </div>
    </div>
  );
}
