"use client";

import { useState, useEffect } from "react";
import { Sigma, Search, Copy, Check, X } from "lucide-react";
import type { Rumus } from "@/types";
import { salinKeClipboard } from "@/lib/utils";

interface RumusPickerDialogProps {
  onInsert: (rumus: string) => void;
}

export function RumusPickerDialog({ onInsert }: RumusPickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [rumusList, setRumusList] = useState<Rumus[]>([]);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/rumus")
      .then((r) => r.json())
      .then(({ data }) => setRumusList(data ?? []));
  }, [open]);

  const filtered = rumusList.filter(
    (r) =>
      r.nama.toLowerCase().includes(search.toLowerCase()) ||
      r.kategori.toLowerCase().includes(search.toLowerCase())
  );

  // Kelompokkan per kategori
  const grouped = filtered.reduce<Record<string, Rumus[]>>((acc, r) => {
    if (!acc[r.kategori]) acc[r.kategori] = [];
    acc[r.kategori].push(r);
    return acc;
  }, {});

  async function handleInsert(r: Rumus) {
    onInsert(`${r.nama}: ${r.rumus}`);
    setOpen(false);
  }

  async function handleCopy(r: Rumus) {
    await salinKeClipboard(r.rumus);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-2.5 py-1.5 rounded-lg transition"
      >
        <Sigma className="w-3.5 h-3.5" />
        Sisipkan Rumus
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Pustaka Rumus</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari rumus..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
              {Object.entries(grouped).map(([kategori, items]) => (
                <div key={kategori} className="mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-1.5">{kategori}</p>
                  {items.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{r.nama}</p>
                        <p className="text-xs font-mono text-blue-600 mt-0.5">{r.rumus}</p>
                        {r.keterangan && <p className="text-xs text-gray-400 mt-0.5">{r.keterangan}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0 mt-0.5">
                        <button
                          onClick={() => handleCopy(r)}
                          className="p-1.5 rounded hover:bg-gray-100 transition"
                          title="Salin rumus"
                        >
                          {copiedId === r.id ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleInsert(r)}
                          className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Sisipkan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {Object.keys(grouped).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">Rumus tidak ditemukan</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
