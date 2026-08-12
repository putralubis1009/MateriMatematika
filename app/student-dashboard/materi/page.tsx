"use client";

import { useState, useEffect } from "react";
import { BookOpen, Loader2, Search, RefreshCw, Calendar } from "lucide-react";
import { MateriDetailView } from "@/components/student/MateriDetailView";

interface Materi {
  id: string;
  judul: string;
  isi: string;
  file_foto?: string | null;
  jenjang: string;
  kelas: number;
  diperbarui_pada: string;
}

export default function StudentMateriPage() {
  const [materi, setMateri] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Materi | null>(null);

  async function loadMateri() {
    setLoading(true);
    const res = await fetch("/api/student/materi");
    const { data } = await res.json();
    setMateri(data ?? []);
    setLoading(false);
  }

  useEffect(() => { loadMateri(); }, []);

  const filtered = materi.filter((m) =>
    m.judul.toLowerCase().includes(search.toLowerCase())
  );

  // Jika ada yang dipilih, tampilkan detail view
  if (selected) {
    return (
      <MateriDetailView
        materi={selected}
        onClose={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">History Pelajaran</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Materi dari gurumu · {materi.length} catatan
          </p>
        </div>
        <button
          onClick={loadMateri}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-200 px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari materi berdasarkan judul..."
          className="input-premium w-full pl-11 pr-4 py-3"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Memuat materi...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-premium p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-semibold">
            {search ? `Tidak ada materi dengan kata kunci "${search}"` : "Belum ada materi dari gurumu."}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Materi akan muncul setelah gurumu menambahkannya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="group card-premium p-5 text-left flex items-start gap-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 animate-fade-in-up cursor-pointer w-full"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center shrink-0 transition-colors">
                <BookOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                  {m.judul}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {m.jenjang} · Kls {m.kelas}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3 h-3" />
                    {new Date(m.diperbarui_pada).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </span>
                </div>
                {m.isi && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {m.isi.slice(0, 100).replace(/\$.*?\$/g, "[rumus]")}...
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
