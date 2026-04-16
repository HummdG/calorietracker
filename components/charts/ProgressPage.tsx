"use client";

import { useState } from "react";
import type { UserRow, EntryRow, GoalsRow } from "@/lib/supabase/types";
import { WeeklyTrendChart } from "./WeeklyTrendChart";
import { CaloriesBurntBar } from "./CaloriesBurntBar";
import { MetricSelector } from "./MetricSelector";
import type { MacroKey } from "@/lib/utils/macros";
import { macroEmoji, macroLabel, macroUnit } from "@/lib/utils/macros";
import { format } from "date-fns";

interface ProgressPageProps {
  users: UserRow[];
  entries: EntryRow[];
  goals: GoalsRow[];
  days: string[]; // last 7 YYYY-MM-DD strings
}

export function ProgressPage({ users, entries, goals, days }: ProgressPageProps) {
  const [metric, setMetric] = useState<MacroKey>("calories");

  const hummd = users.find((u) => u.color === "hummd");
  const hafsa = users.find((u) => u.color === "hafsa");

  const hummdGoals = goals.find((g) => g.user_id === hummd?.id);
  const hafsaGoals = goals.find((g) => g.user_id === hafsa?.id);

  // Build chart data indexed by date
  const chartData = days.map((date) => {
    const hummdEntry = entries.find(
      (e) => e.user_id === hummd?.id && e.date === date
    );
    const hafsaEntry = entries.find(
      (e) => e.user_id === hafsa?.id && e.date === date
    );
    return {
      date,
      hummd: hummdEntry?.[metric] ?? null,
      hafsa: hafsaEntry?.[metric] ?? null,
    };
  });

  const burntData = days.map((date) => {
    const hummdEntry = entries.find(
      (e) => e.user_id === hummd?.id && e.date === date
    );
    const hafsaEntry = entries.find(
      (e) => e.user_id === hafsa?.id && e.date === date
    );
    return {
      date,
      hummd: hummdEntry?.calories_burnt ?? null,
      hafsa: hafsaEntry?.calories_burnt ?? null,
    };
  });

  // 7-day averages
  function avg(userId: string, key: MacroKey): string {
    const vals = entries
      .filter((e) => e.user_id === userId && e[key] != null)
      .map((e) => e[key] as number);
    if (!vals.length) return "—";
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length).toString();
  }

  const unit = macroUnit(metric);

  const getTarget = (userId: string): number | undefined => {
    const g = goals.find((g) => g.user_id === userId);
    if (!g) return undefined;
    return metric === "calories"
      ? g.calories_target
      : metric === "protein"
      ? g.protein_target
      : g.fibre_target;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">Progress 📈</h1>
        <p className="text-sm text-gray-400 mt-0.5 font-medium">Last 7 days</p>
      </div>

      {/* Avg stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {[hummd, hafsa].map((user) => {
          if (!user) return null;
          const isHummd = user.color === "hummd";
          const avgVal = avg(user.id, metric);
          const target = getTarget(user.id);
          return (
            <div
              key={user.id}
              className={`rounded-2xl p-4 ${isHummd ? "bg-hummd-50 border border-hummd-100" : "bg-hafsa-50 border border-hafsa-100"}`}
            >
              <p className="text-xs font-bold text-gray-400 mb-1">
                {user.emoji} {user.name} · 7-day avg
              </p>
              <p
                className={`text-2xl font-extrabold ${isHummd ? "text-hummd-700" : "text-hafsa-700"}`}
              >
                {avgVal}
                {avgVal !== "—" && (
                  <span className="text-sm font-semibold ml-1">{unit}</span>
                )}
              </p>
              {target && avgVal !== "—" && (
                <p className="text-xs text-gray-400 mt-1">
                  Goal: {target}{unit}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-700">
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

      {/* Calories burnt chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-4">🏃 Calories Burnt</h3>
        <CaloriesBurntBar data={burntData} />
      </div>
    </div>
  );
}
