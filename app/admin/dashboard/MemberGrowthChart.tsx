"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type ChartPoint = { month: string; count: number };

export function MemberGrowthChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={240}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "rgba(250,246,238,0.4)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(201,168,76,0.2)" }}
            tickLine={{ stroke: "rgba(201,168,76,0.2)" }}
          />
          <YAxis
            tick={{ fill: "rgba(250,246,238,0.4)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(201,168,76,0.2)" }}
            tickLine={{ stroke: "rgba(201,168,76,0.2)" }}
          />
          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 4,
            }}
            labelStyle={{ color: "var(--text-primary)" }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--gold-primary)"
            strokeWidth={2}
            dot={{ fill: "var(--gold-primary)", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
