"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import type { MacroKey } from "@/lib/utils/macros";
import { macroUnit } from "@/lib/utils/macros";
import { formatDateShort } from "@/lib/utils/dates";

interface ChartDataPoint {
  date: string;         // "YYYY-MM-DD"
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
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  metric: MacroKey;
}) => {
  if (!active || !payload?.length) return null;
  const unit = macroUnit(metric);
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 text-xs">
      <p className="font-bold text-gray-600 mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value ?? "—"}{p.value != null ? unit : ""}
        </p>
      ))}
    </div>
  );
};

export function WeeklyTrendChart({
  data,
  metric,
  hummdTarget,
  hafsaTarget,
}: WeeklyTrendChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: formatDateShort(d.date),
  }));

  const unit = macroUnit(metric);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "var(--font-nunito)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "var(--font-nunito)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}${unit}`}
        />
        <Tooltip content={<CustomTooltip metric={metric} />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-nunito)", paddingTop: 8 }}
        />

        {hummdTarget && (
          <ReferenceLine
            y={hummdTarget}
            stroke="#0ea5e9"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            opacity={0.5}
          />
        )}
        {hafsaTarget && (
          <ReferenceLine
            y={hafsaTarget}
            stroke="#f43f5e"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            opacity={0.5}
          />
        )}

        <Line
          type="monotone"
          dataKey="hummd"
          name="Hummd"
          stroke="#0ea5e9"
          strokeWidth={2.5}
          dot={{ fill: "#0ea5e9", r: 4, strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="hafsa"
          name="Hafsa"
          stroke="#f43f5e"
          strokeWidth={2.5}
          dot={{ fill: "#f43f5e", r: 4, strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
