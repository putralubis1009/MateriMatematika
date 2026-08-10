"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, BookOpen, Trash2, Download, FileText } from "lucide-react";
import type { Materi } from "@/types";
import { formatTanggalPendek, truncate } from "@/lib/utils";
import { JenjangBadge } from "@/components/ui/JenjangBadge";
import { useJenjang } from "@/components/layout/JenjangProvider";
import { JENJANG_CONFIG, JENJANG_ORDER } from "@/lib/jenjang";
import type { Jenjang } from "@/types";
import { cn } from "@/lib/utils";

interface MateriListProps {
  materi: Materi[];
  searchQuery?: string;
}

export function MateriList({ materi: initialMateri, searchQuery }: MateriListProps) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery ?? "");
  const [materi, setMateri] = useState(initialMateri);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterJenjang, setFilterJenjang] = useState<Jenjang | "semua">("semua");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/materi${search ? `?q=${encodeURIComponent(search)}` : ""}`);
  }

  async function handleDelete(id: string, judul: string) {
    if (!confirm(`Hapus catatan "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(id);
    await fetch(`/api/materi/${id}`, { method: "DELETE" });
    setMateri((m) => m.filter((x) => x.id !== id));
    setDeletingId(null);
  }

  const filtered = materi.filter((m) => {
    const matchSearch = search
      ? m.judul.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchJenjang = filterJenjang === "semua"
      ? true
      : m.jenjang === filterJenjang;
    return matchSearch && matchJenjang;
  });

  const grouped = JENJANG_ORDER.reduce<Record<string, Materi[]>>((acc, j) => {
    const items = filtered.filter((m) => m.jenjang === j);
    if (items.length > 0) acc[j] = items;
    return acc;
  }, {});
  const ungrouped = filtered.filter((m) => !m.jenjang);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari materi berdasarkan judul..."
          className="input-premium w-full pl-11 pr-4 py-3"
        />
      </form>

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
              {j}
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-indigo-300" />
          </div>
          <p className="text-slate-500 font-medium text-sm">
            {search ? `Tidak ada materi dengan kata kunci "${search}"` : "Belum ada catatan materi."}
          </p>
          {!search && (
            <Link href="/materi/baru" className="btn-primary inline-flex items-center gap-2 mt-6">
              <Plus className="w-4 h-4" />
              Buat Catatan Pertama
            </Link>
          )}
        </div>
      ) : filterJenjang === "semua" ? (
        <div className="space-y-8">
          {Object.entries(grouped).map(([j, items]) => {
            const cfg = JENJANG_CONFIG[j as Jenjang];
            return (
              <section key={j}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={cn("text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg", cfg.bgColor, cfg.color)}>
                    {j}
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{items.length} materi</span>
                </div>
                <MateriItemList items={items} deletingId={deletingId} onDelete={handleDelete} />
              </section>
            );
          })}
          {ungrouped.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500">
                  TANPA JENJANG
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <MateriItemList items={ungrouped} deletingId={deletingId} onDelete={handleDelete} />
            </section>
          )}
        </div>
      ) : (
        <MateriItemList items={filtered} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </div>
  );
}

function MateriItemList({
  items,
  deletingId,
  onDelete,
}: {
  items: Materi[];
  deletingId: string | null;
  onDelete: (id: string, judul: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((m) => (
        <div
          key={m.id}
          className="group card-premium p-5 flex flex-col justify-between"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <Link href={`/materi/${m.id}`} className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition truncate">
                {m.judul}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {m.jenjang && <JenjangBadge jenjang={m.jenjang} kelas={m.kelas} size="xs" />}
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {formatTanggalPendek(m.diperbarui_pada)}
                </span>
              </div>
              {m.isi && (
                <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">{truncate(m.isi, 120)}</p>
              )}
            </Link>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={`/api/materi/${m.id}/pdf`}
              target="_blank"
              className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition flex items-center justify-center"
              title="Unduh PDF"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => onDelete(m.id, m.judul)}
              disabled={deletingId === m.id}
              className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition flex items-center justify-center"
              title="Hapus catatan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
