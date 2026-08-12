"use client";

import { ClipboardList, Clock, AlertCircle, BookOpen, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusTugas = "belum" | "dikerjakan" | "selesai_dinilai";

const LABEL_STATUS: Record<StatusTugas, string> = {
  belum: "Belum Dikerjakan",
  dikerjakan: "Sedang Dikerjakan",
  selesai_dinilai: "Selesai Dinilai",
};

const WARNA_STATUS: Record<StatusTugas, string> = {
  belum: "bg-orange-50 text-orange-600 border-orange-200",
  dikerjakan: "bg-blue-50 text-blue-600 border-blue-200",
  selesai_dinilai: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

interface SoalCardProps {
  soal: {
    id: string;
    deskripsi: string;
    tenggat?: string | null;
    status: StatusTugas;
    materi?: { id: string; judul: string } | null;
  };
}

function formatTenggat(tanggal?: string | null): string {
  if (!tanggal) return "";
  return new Date(tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isTenggat(tanggal?: string | null): boolean {
  if (!tanggal) return false;
  return new Date(tanggal) < new Date();
}

export function SoalCard({ soal }: SoalCardProps) {
  const terlewat = soal.tenggat ? isTenggat(soal.tenggat) : false;

  return (
    <div className="card-premium p-5 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
          soal.status === "selesai_dinilai"
            ? "bg-emerald-50"
            : soal.status === "dikerjakan"
            ? "bg-blue-50"
            : "bg-orange-50"
        )}>
          <ClipboardList className={cn(
            "w-5 h-5",
            soal.status === "selesai_dinilai" ? "text-emerald-500"
            : soal.status === "dikerjakan" ? "text-blue-500"
            : "text-orange-500"
          )} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Deskripsi */}
          <p className="text-[15px] font-semibold text-slate-800 leading-relaxed">
            {soal.deskripsi}
          </p>

          {/* Materi terkait */}
          {soal.materi && (
            <div className="flex items-center gap-1.5 mt-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-500">{soal.materi.judul}</span>
            </div>
          )}

          {/* Footer: status + tenggat */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Badge status */}
            <span className={cn(
              "text-xs font-bold px-3 py-1 rounded-full border",
              WARNA_STATUS[soal.status]
            )}>
              {LABEL_STATUS[soal.status]}
            </span>

            {/* Tenggat */}
            {soal.tenggat && (
              <span className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg",
                terlewat
                  ? "bg-red-50 text-red-600"
                  : "bg-slate-100 text-slate-500"
              )}>
                {terlewat
                  ? <AlertCircle className="w-3.5 h-3.5" />
                  : <Clock className="w-3.5 h-3.5" />
                }
                {terlewat ? "Terlewat: " : "Tenggat: "}{formatTenggat(soal.tenggat)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
