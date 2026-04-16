"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatDateShort } from "@/lib/utils/dates";

interface BurntDataPoint {
  date: string;
  hummd?: number | null;
  hafsa?: number | null;
}

export function CaloriesBurntBar({ data }: { data: BurntDataPoint[] }) {
  const formatted = data.map((d) => ({ ...d, label: formatDateShort(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={formatted} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="4 4" stroke="rgba(28,16,6,0.08)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "4px 8px 5px 7px",
            border: "1.5px solid rgba(28,16,6,0.15)",
            background: "var(--paper-0)",
            fontFamily: "var(--font-fraunces)",
            fontSize: 12,
            fontWeight: 700,
            boxShadow: "var(--shadow-sm)",
          }}
          formatter={(value) => [`${value} kcal`, ""]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-fraunces)", fontWeight: 700 }}
        />
        <Bar dataKey="hummd" name="Hummd" fill="var(--hummd)" opacity={0.85} radius={[5, 5, 0, 0]} />
        <Bar dataKey="hafsa" name="Hafsa" fill="var(--hafsa)" opacity={0.85} radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
