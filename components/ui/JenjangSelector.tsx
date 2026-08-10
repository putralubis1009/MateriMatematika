"use client";

import type { Jenjang } from "@/types";
import { JENJANG_CONFIG, JENJANG_ORDER } from "@/lib/jenjang";
import { cn } from "@/lib/utils";

interface JenjangSelectorProps {
  jenjang: Jenjang;
  kelas: number;
  onChange: (jenjang: Jenjang, kelas: number) => void;
  className?: string;
}

export function JenjangSelector({ jenjang, kelas, onChange, className }: JenjangSelectorProps) {
  const cfg = JENJANG_CONFIG[jenjang];

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-gray-700">Jenjang & Kelas *</label>
      {/* Jenjang Tabs */}
      <div className="flex gap-2">
        {JENJANG_ORDER.map((j) => {
          const c = JENJANG_CONFIG[j];
          return (
            <button
              key={j}
              type="button"
              onClick={() => onChange(j, c.kelas[0])}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-lg border transition-all",
                jenjang === j
                  ? `${c.bgColor} ${c.color} ${c.borderColor}`
                  : "text-gray-400 border-gray-200 hover:border-gray-300"
              )}
            >
              {j}
            </button>
          );
        })}
      </div>
      {/* Kelas Pills */}
      <div className="flex gap-2">
        {cfg.kelas.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onChange(jenjang, k)}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-lg border transition-all",
              kelas === k
                ? `${cfg.bgColor} ${cfg.color} ${cfg.borderColor}`
                : "text-gray-400 border-gray-200 hover:border-gray-300"
            )}
          >
            Kelas {k}
          </button>
        ))}
      </div>
    </div>
  );
}
