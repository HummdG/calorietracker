"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatDateShort } from "@/lib/utils/dates";

interface BurntDataPoint {
  date: string;
  hummd?: number | null;
  hafsa?: number | null;
}

export function CaloriesBurntBar({ data }: { data: BurntDataPoint[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: formatDateShort(d.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={formatted}
        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
        barCategoryGap="35%"
      >
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
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #f1f5f9",
            fontFamily: "var(--font-nunito)",
            fontSize: 12,
          }}
          formatter={(value) => [`${value} kcal`, ""]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-nunito)" }}
        />
        <Bar dataKey="hummd" name="Hummd" fill="#38bdf8" radius={[6, 6, 0, 0]} />
        <Bar dataKey="hafsa" name="Hafsa" fill="#fb7185" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
