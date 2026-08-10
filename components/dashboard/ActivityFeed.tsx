"use client";

import { formatWaktuRelatif, LABEL_AKTIVITAS } from "@/lib/utils";
import type { Aktivitas } from "@/types";

interface ActivityFeedProps {
  aktivitas: Aktivitas[];
}

const AKTIVITAS_COLORS: Record<string, string> = {
  buat_materi:       "bg-blue-500",
  edit_materi:       "bg-sky-500",
  hapus_materi:      "bg-red-400",
  buat_kegiatan:     "bg-emerald-500",
  selesai_kegiatan:  "bg-teal-500",
  tambah_tugas:      "bg-violet-500",
  update_status_tugas: "bg-purple-500",
  tanya_ai:          "bg-indigo-500",
  scan_foto:         "bg-orange-400",
};

export function ActivityFeed({ aktivitas }: ActivityFeedProps) {
  if (aktivitas.length === 0) {
    return (
      <div className="card-premium p-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">📭</span>
        </div>
        <p className="text-slate-500 font-medium text-sm">Belum ada aktivitas tercatat</p>
        <p className="text-slate-400 text-xs mt-1">Aktivitas akan muncul di sini setelah kamu mulai menggunakan aplikasi</p>
      </div>
    );
  }

  return (
    <div className="card-premium overflow-hidden">
      {aktivitas.map((a, idx) => {
        const dotColor = AKTIVITAS_COLORS[a.jenis] ?? "bg-slate-400";
        const emoji = LABEL_AKTIVITAS[a.jenis]?.split(" ")[0] ?? "📌";
        return (
          <div
            key={a.id}
            className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group"
            style={{ borderTop: idx > 0 ? "1px solid #f1f5f9" : "none" }}
          >
            {/* Timeline dot */}
            <div className="relative flex flex-col items-center mt-1.5 flex-shrink-0">
              <div className={`w-2 h-2 rounded-full ${dotColor}`} />
              {idx < aktivitas.length - 1 && (
                <div className="w-px flex-1 mt-1 bg-slate-100 absolute top-3 bottom-0 left-1/2 -translate-x-1/2" style={{ minHeight: "28px" }} />
              )}
            </div>

            {/* Emoji icon */}
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-base flex-shrink-0 transition-colors">
              {emoji}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 font-medium leading-snug">{a.deskripsi}</p>
              <p className="text-xs text-slate-400 mt-1">{formatWaktuRelatif(a.waktu)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
