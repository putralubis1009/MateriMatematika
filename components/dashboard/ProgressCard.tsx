"use client";

import { BookOpen, CalendarDays, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  label: string;
  total: number;
  selesai?: number;
  icon: "book" | "calendar" | "clipboard";
  color: "blue" | "green" | "purple";
}

const iconMap = { book: BookOpen, calendar: CalendarDays, clipboard: ClipboardList };

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    label: "text-blue-600",
    bar: "bg-blue-500",
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-600",
    label: "text-green-600",
    bar: "bg-green-500",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-100 text-purple-600",
    label: "text-purple-600",
    bar: "bg-purple-500",
  },
};

export function ProgressCard({ label, total, selesai, icon, color }: ProgressCardProps) {
  const Icon = iconMap[icon];
  const c = colorMap[color];
  const persen = selesai !== undefined && total > 0 ? Math.round((selesai / total) * 100) : null;

  return (
    <div className={cn("rounded-2xl p-5 border border-white shadow-sm", c.bg)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", c.icon)}>
          <Icon className="w-4 h-4" />
        </div>
        <span className={cn("text-xs font-semibold", c.label)}>{label}</span>
      </div>

      <p className="text-3xl font-bold text-gray-900">{total}</p>

      {selesai !== undefined && (
        <>
          <p className="text-xs text-gray-500 mt-1">{selesai} dari {total} selesai</p>
          <div className="mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", c.bar)}
              style={{ width: `${persen}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
