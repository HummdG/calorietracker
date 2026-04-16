"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import type { MacroKey } from "@/lib/utils/macros";
import { macroUnit } from "@/lib/utils/macros";
import { formatDateShort } from "@/lib/utils/dates";

interface ChartDataPoint {
  date: string;
  hummd?: number | null;
  hafsa?: number | null;
}

interface WeeklyTrendChartProps {
  data: ChartDataPoint[];
  metric: MacroKey;
  hummdTarget?: number;
  hafsaTarget?: number;
}

const CustomTooltip = ({
  active, payload, label, metric,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  metric: MacroKey;
}) => {
  if (!active || !payload?.length) return null;
  const unit = macroUnit(metric);
  return (
    <div
      style={{
        background: "var(--paper-0)",
        border: "1.5px solid rgba(28,16,6,0.15)",
        borderRadius: "4px 8px 5px 7px",
        padding: "10px 14px",
        boxShadow: "var(--shadow-sm)",
        fontFamily: "var(--font-fraunces)",
        fontSize: 12,
      }}
    >
      <p style={{ color: "var(--ink-mid)", marginBottom: 6, fontWeight: 700 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 800 }}>
          {p.name}: {p.value ?? "—"}{p.value != null ? unit : ""}
        </p>
      ))}
    </div>
  );
};

export function WeeklyTrendChart({ data, metric, hummdTarget, hafsaTarget }: WeeklyTrendChartProps) {
  const formatted = data.map((d) => ({ ...d, label: formatDateShort(d.date) }));
  const unit = macroUnit(metric);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="rgba(28,16,6,0.08)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          width={68}
          tick={{ fontSize: 11, fill: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}${unit}`}
        />
        <Tooltip content={<CustomTooltip metric={metric} />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-fraunces)", paddingTop: 8, fontWeight: 700 }}
        />
        {hummdTarget && (
          <ReferenceLine y={hummdTarget} stroke="var(--hummd)" strokeDasharray="5 4" strokeWidth={1.5} opacity={0.4} />
        )}
        {hafsaTarget && (
          <ReferenceLine y={hafsaTarget} stroke="var(--hafsa)" strokeDasharray="5 4" strokeWidth={1.5} opacity={0.4} />
        )}
        <Line
          type="monotone" dataKey="hummd" name="Hummd"
          stroke="var(--hummd)" strokeWidth={3}
          dot={{ fill: "var(--hummd)", r: 5, strokeWidth: 2, stroke: "var(--paper-0)" }}
          activeDot={{ r: 7 }}
          connectNulls={false}
        />
        <Line
          type="monotone" dataKey="hafsa" name="Hafsa"
          stroke="var(--hafsa)" strokeWidth={3}
          dot={{ fill: "var(--hafsa)", r: 5, strokeWidth: 2, stroke: "var(--paper-0)" }}
          activeDot={{ r: 7 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
