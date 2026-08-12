"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Loader2, BookOpen, RefreshCw } from "lucide-react";
import { SoalCard } from "@/components/student/SoalCard";

type StatusTugas = "belum" | "dikerjakan" | "selesai_dinilai";

interface Soal {
  id: string;
  deskripsi: string;
  tenggat?: string | null;
  status: StatusTugas;
  materi?: { id: string; judul: string } | null;
}

const STATUS_TABS = [
  { key: "semua", label: "Semua" },
  { key: "belum", label: "Belum Dikerjakan" },
  { key: "dikerjakan", label: "Sedang Dikerjakan" },
  { key: "selesai_dinilai", label: "Selesai" },
] as const;

type FilterKey = "semua" | StatusTugas;

export default function StudentSoalPage() {
  const [soal, setSoal] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("semua");

  async function loadSoal() {
    setLoading(true);
    try {
      const res = await fetch("/api/student/soal");
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (json.error) {
          console.error("Gagal memuat soal:", json.error);
          setSoal([]);
        } else {
          setSoal(json.data ?? []);
        }
      } catch (parseErr) {
        console.error("Server tidak merespons JSON (Mungkin crash):", text.substring(0, 150));
        setSoal([]);
      }
    } catch (err) {
      console.error("Network/Server error:", err);
      setSoal([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSoal(); }, []);

  const filtered = filter === "semua"
    ? soal
    : soal.filter((s) => s.status === filter);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Soal</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Soal dan tugas dari gurumu · {soal.length} total
          </p>
        </div>
        <button
          onClick={loadSoal}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-200 px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as FilterKey)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
              filter === key
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Memuat soal...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-premium p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-semibold">
            {filter === "semua"
              ? "Belum ada soal dari gurumu."
              : `Tidak ada soal dengan status ini.`}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Soal akan muncul di sini setelah gurumu menambahkannya.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s, i) => (
            <div key={s.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <SoalCard soal={s} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
