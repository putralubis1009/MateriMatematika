"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import type { Kegiatan } from "@/types";
import { formatTanggalPendek } from "@/lib/utils";

export function RiwayatKegiatanPage() {
  const [riwayat, setRiwayat] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kegiatan/riwayat")
      .then((r) => r.json())
      .then(({ data }) => { setRiwayat(data ?? []); setLoading(false); });
  }, []);

  // Kelompok per tanggal
  const grouped = riwayat.reduce<Record<string, Kegiatan[]>>((acc, k) => {
    const key = k.tanggal;
    if (!acc[key]) acc[key] = [];
    acc[key].push(k);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/jadwal" className="text-gray-400 hover:text-gray-600 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Riwayat Kegiatan</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <History className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada riwayat kegiatan</p>
        </div>
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([tanggal, items]) => (
            <section key={tanggal}>
              <h2 className="text-sm font-semibold text-gray-500 mb-2">
                {formatTanggalPendek(tanggal)}
              </h2>
              <div className="space-y-2">
                {items.map((k) => (
                  <div
                    key={k.id}
                    className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 flex items-center gap-3"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        k.selesai ? "bg-green-400" : "bg-gray-300"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">{k.nama}</p>
                      {k.materi && (
                        <p className="text-xs text-blue-500 mt-0.5">📖 {k.materi.judul}</p>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        k.selesai
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {k.selesai ? "Selesai" : "Belum"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))
      )}
    </div>
  );
}
