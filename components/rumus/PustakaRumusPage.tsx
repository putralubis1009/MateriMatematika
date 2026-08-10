"use client";

import { useState } from "react";
import { Copy, Check, Search, Calculator } from "lucide-react";
import type { Rumus, Jenjang } from "@/types";
import { salinKeClipboard } from "@/lib/utils";
import { useJenjang } from "@/components/layout/JenjangProvider";
import { JENJANG_CONFIG, JENJANG_ORDER } from "@/lib/jenjang";
import { cn } from "@/lib/utils";

interface PustakaRumusPageProps {
  rumus: Rumus[];
}

export function PustakaRumusPage({ rumus }: PustakaRumusPageProps) {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterJenjang, setFilterJenjang] = useState<Jenjang | "semua">("semua");
  const { jenjang: activeJenjang } = useJenjang();

  async function handleCopy(r: Rumus) {
    await salinKeClipboard(r.rumus);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filtered = rumus.filter((r) => {
    const matchSearch =
      r.nama.toLowerCase().includes(search.toLowerCase()) ||
      r.kategori.toLowerCase().includes(search.toLowerCase()) ||
      r.rumus.toLowerCase().includes(search.toLowerCase());
    const matchJenjang =
      filterJenjang === "semua" || (r.jenjang && r.jenjang.includes(filterJenjang));
    return matchSearch && matchJenjang;
  });

  const grouped = filtered.reduce<Record<string, Rumus[]>>((acc, r) => {
    if (!acc[r.kategori]) acc[r.kategori] = [];
    acc[r.kategori].push(r);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pustaka Rumus</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Kumpulan rumus matematika siap pakai per jenjang</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari rumus atau kategori..."
          className="input-premium w-full pl-11 pr-4 py-3"
        />
      </div>

      {/* Jenjang Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterJenjang("semua")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 border",
            filterJenjang === "semua"
              ? "bg-slate-800 text-white border-slate-800 shadow-md"
              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          Semua Jenjang
        </button>
        {JENJANG_ORDER.map((j) => {
          const cfg = JENJANG_CONFIG[j];
          const isActive = filterJenjang === j;
          return (
            <button
              key={j}
              onClick={() => setFilterJenjang(j)}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 border",
                isActive
                  ? `${cfg.bgColor} ${cfg.color} ${cfg.borderColor} shadow-sm`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {j} <span className="opacity-70 font-semibold ml-1">Kls {cfg.kelas.join('-')}</span>
            </button>
          );
        })}
      </div>

      {/* Grouped Rumus */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([kategori, items], idx) => (
          <section key={kategori} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                {kategori}
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((r) => (
                <div
                  key={r.id}
                  className="group card-premium p-4 hover:border-indigo-200 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold text-slate-800">{r.nama}</p>
                      {r.jenjang && (
                        <p className="text-[10px] font-semibold text-indigo-500 tracking-wide uppercase mt-1">
                          {r.jenjang}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopy(r)}
                      className="shrink-0 p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      title="Salin rumus"
                    >
                      {copiedId === r.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3 font-mono text-sm text-indigo-600 break-all mb-2 border border-slate-100 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-indigo-300 shrink-0" />
                    <span>{r.rumus}</span>
                  </div>
                  
                  {r.keterangan && (
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">{r.keterangan}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="card-premium p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">Tidak ada rumus yang ditemukan</p>
        </div>
      )}
    </div>
  );
}
