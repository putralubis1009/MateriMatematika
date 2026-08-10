"use client";

import { Edit, Trash2, AlertCircle, Clock } from "lucide-react";
import type { Tugas, StatusTugasType } from "@/types";
import { LABEL_STATUS_TUGAS, WARNA_STATUS_TUGAS, getStatusTenggat, getLabelTenggat, cn } from "@/lib/utils";

const STATUS_OPTIONS: StatusTugasType[] = ["belum", "dikerjakan", "selesai_dinilai"];

interface TugasCardProps {
  tugas: Tugas;
  onUpdateStatus: (id: string, status: StatusTugasType) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function TugasCard({ tugas: t, onUpdateStatus, onEdit, onDelete }: TugasCardProps) {
  const statusTenggat = getStatusTenggat(t.tenggat);
  const labelTenggat = getLabelTenggat(t.tenggat);
  
  const isSelesai = t.status === "selesai_dinilai";

  return (
    <div className={cn(
      "group card-premium p-5 transition-all duration-300",
      isSelesai ? "bg-slate-50/50" : "bg-white"
    )}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Deskripsi */}
          <p className={cn(
            "text-[15px] font-semibold leading-relaxed transition-colors",
            isSelesai ? "text-slate-500" : "text-slate-800"
          )}>
            {t.deskripsi}
          </p>

          {/* Materi terkait */}
          {t.materi && (
            <p className="text-xs font-medium text-indigo-500 mt-2 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-indigo-100 flex items-center justify-center">📖</span>
              {t.materi.judul}
            </p>
          )}

          {/* Info bawah */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* Tenggat */}
            {t.tenggat && (
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md",
                  statusTenggat === "terlewat" ? "bg-red-50 text-red-600" :
                  statusTenggat === "dekat" ? "bg-orange-50 text-orange-600" :
                  "bg-slate-100 text-slate-500"
                )}
              >
                {statusTenggat === "terlewat" ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {labelTenggat}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition flex items-center justify-center"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(t.id)}
            className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Selector */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onUpdateStatus(t.id, s)}
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-lg border transition-all duration-200",
              t.status === s
                ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                : "text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            {LABEL_STATUS_TUGAS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
