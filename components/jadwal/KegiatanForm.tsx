"use client";

import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import type { Kegiatan, Materi, Jenjang } from "@/types";

interface KegiatanFormProps {
  tanggalDefault: string;
  jenjang: Jenjang;
  kelas: number;
  onAdded: (kegiatan: Kegiatan) => void;
  onCancel: () => void;
}

export function KegiatanForm({ tanggalDefault, jenjang, kelas, onAdded, onCancel }: KegiatanFormProps) {
  const [nama, setNama] = useState("");
  const [tanggal, setTanggal] = useState(tanggalDefault);
  const [materiId, setMateriId] = useState("");
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/materi")
      .then((r) => r.json())
      .then(({ data }) => setMateriList(data ?? []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/kegiatan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, tanggal, materi_id: materiId || null, jenjang, kelas }),
    });

    const json = await res.json();
    if (res.ok) {
      onAdded(json.data);
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-premium p-5 space-y-4 bg-slate-50/50"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <p className="font-bold text-slate-800">Tambah Kegiatan Baru</p>
        <button type="button" onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <input
        autoFocus
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="Nama kegiatan (contoh: Mengajar Bab 1)..."
        required
        className="input-premium w-full"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tanggal</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="input-premium w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Materi Terkait</label>
          <select
            value={materiId}
            onChange={(e) => setMateriId(e.target.value)}
            className="input-premium w-full text-slate-700"
          >
            <option value="">— Opsional —</option>
            {materiList.map((m) => (
              <option key={m.id} value={m.id}>{m.judul}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Kegiatan"}
      </button>
    </form>
  );
}
