"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ChartData = {
  date: string;
  revenue: number;
};

export default function RevenueChart({ data }: { data: ChartData[] }) {
  return (
    <div className="rounded-2xl border p-4 shadow-md bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              padding: "0.5rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1" // Indigo-500
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#6366f1" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
