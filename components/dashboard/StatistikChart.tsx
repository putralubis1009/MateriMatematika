"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface StatistikChartProps {
  userId: string;
}

const RANGE_OPTIONS = [
  { label: "7 Hari", value: 7 },
  { label: "30 Hari", value: 30 },
];

export function StatistikChart({ userId: _ }: StatistikChartProps) {
  const [range, setRange] = useState(7);
  const [data, setData] = useState<Array<{ tanggal: string; materi_dibuat: number; kegiatan_selesai: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard/statistik?range=${range}`)
      .then((r) => r.json())
      .then(({ data }) => {
        setData(data ?? []);
        setLoading(false);
      });
  }, [range]);

  const formattedData = data.map((d) => ({
    ...d,
    label: format(new Date(d.tanggal), "dd MMM", { locale: id }),
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-700">Statistik Belajar</h2>
        <div className="flex gap-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                range === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={formattedData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="materi_dibuat" name="Materi Dibuat" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="kegiatan_selesai" name="Kegiatan Selesai" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
