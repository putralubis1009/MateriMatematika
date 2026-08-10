"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";
import type { Kegiatan } from "@/types";
import { KegiatanItem } from "./KegiatanItem";
import { KegiatanForm } from "./KegiatanForm";
import { useJenjang } from "@/components/layout/JenjangProvider";
import { JENJANG_CONFIG } from "@/lib/jenjang";
import { cn } from "@/lib/utils";

export function JadwalPage() {
  const [tanggal, setTanggal] = useState(new Date());
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { jenjang, kelas } = useJenjang();
  const cfg = JENJANG_CONFIG[jenjang];

  const tanggalStr = format(tanggal, "yyyy-MM-dd");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/kegiatan?tanggal=${tanggalStr}&jenjang=${jenjang}&kelas=${kelas}`)
      .then((r) => r.json())
      .then(({ data }) => {
        setKegiatan(data ?? []);
        setLoading(false);
      });
  }, [tanggalStr, jenjang, kelas]);

  async function handleTandaiSelesai(kegiatanId: string, selesai: boolean) {
    await fetch(`/api/kegiatan/${kegiatanId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selesai }),
    });
    setKegiatan((prev) =>
      prev.map((k) => (k.id === kegiatanId ? { ...k, selesai, selesai_pada: selesai ? new Date().toISOString() : null } : k))
    );
  }

  async function handleDelete(kegiatanId: string) {
    await fetch(`/api/kegiatan/${kegiatanId}`, { method: "DELETE" });
    setKegiatan((prev) => prev.filter((k) => k.id !== kegiatanId));
  }

  function handleAdded(k: Kegiatan) {
    setKegiatan((prev) => [...prev, k]);
    setShowForm(false);
  }

  const selesaiCount = kegiatan.filter((k) => k.selesai).length;
  const progress = kegiatan.length > 0 ? (selesaiCount / kegiatan.length) * 100 : 0;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Jadwal & Checklist</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md", cfg.bgColor, cfg.color)}>
              {jenjang}
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Kelas {kelas}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Kegiatan Baru
        </button>
      </div>

      {/* Navigasi Tanggal (Glass card) */}
      <div className="card-premium p-1.5 flex items-center justify-between gap-3 bg-white/60 backdrop-blur-md">
        <button
          onClick={() => setTanggal((d) => subDays(d, 1))}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1 text-center py-2">
          <p className="font-bold text-slate-800 text-[15px]">
            {format(tanggal, "EEEE, dd MMMM yyyy", { locale: id })}
          </p>
          {!loading && kegiatan.length > 0 && (
            <div className="mt-2 flex items-center justify-center gap-3 max-w-[200px] mx-auto">
              <span className="text-xs font-bold text-slate-400">{selesaiCount}/{kegiatan.length}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", progress === 100 ? "bg-emerald-500" : "bg-indigo-500")}
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setTanggal((d) => addDays(d, 1))}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-700"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Form Tambah */}
      {showForm && (
        <div className="animate-fade-in-up">
          <KegiatanForm
            tanggalDefault={tanggalStr}
            jenjang={jenjang}
            kelas={kelas}
            onAdded={handleAdded}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Daftar Kegiatan */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl shimmer" />)}
        </div>
      ) : kegiatan.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8 text-indigo-300" />
          </div>
          <p className="text-slate-500 font-medium">Tidak ada kegiatan untuk {jenjang} Kelas {kelas} hari ini</p>
          <p className="text-slate-400 text-sm mt-1">Klik "Kegiatan Baru" untuk mulai membuat jadwal.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {kegiatan.map((k, i) => (
            <div key={k.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <KegiatanItem
                kegiatan={k}
                onToggle={handleTandaiSelesai}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
