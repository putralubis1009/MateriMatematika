"use client";

import { Check, Trash2 } from "lucide-react";
import type { Kegiatan } from "@/types";
import { cn } from "@/lib/utils";

interface KegiatanItemProps {
  kegiatan: Kegiatan;
  onToggle: (id: string, selesai: boolean) => void;
  onDelete: (id: string) => void;
}

export function KegiatanItem({ kegiatan: k, onToggle, onDelete }: KegiatanItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-5 py-4 transition-all duration-200 card-premium",
        k.selesai ? "bg-slate-50/50 border-slate-100" : "bg-white hover:border-indigo-200"
      )}
    >
      {/* Tombol centang */}
      <button
        onClick={() => onToggle(k.id, !k.selesai)}
        className={cn(
          "w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center shrink-0 transition-all duration-300 relative overflow-hidden",
          k.selesai
            ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/20"
            : "border-slate-300 hover:border-indigo-400 bg-slate-50"
        )}
        title={k.selesai ? "Tandai belum selesai" : "Tandai selesai"}
      >
        <div className={cn(
          "absolute inset-0 bg-emerald-500 flex items-center justify-center transition-transform duration-300",
          k.selesai ? "scale-100" : "scale-0"
        )}>
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
        </div>
      </button>

      {/* Nama & Info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-[15px] font-semibold transition-colors duration-200",
          k.selesai ? "line-through text-slate-400" : "text-slate-800"
        )}>
          {k.nama}
        </p>
        {k.materi && (
          <p className="text-xs font-medium text-indigo-500 mt-1 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-indigo-100 flex items-center justify-center">📖</span>
            {k.materi.judul}
          </p>
        )}
      </div>

      {/* Hapus */}
      <button
        onClick={() => onDelete(k.id)}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-300 hover:text-red-500 transition flex items-center justify-center"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
