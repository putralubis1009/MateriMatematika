"use client";

import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import type { Tugas, Materi, FormTugas } from "@/types";

interface TugasFormProps {
  tugas?: Tugas;
  onSave: (form: FormTugas, id?: string) => void;
  onCancel: () => void;
}

export function TugasForm({ tugas, onSave, onCancel }: TugasFormProps) {
  const [form, setForm] = useState<FormTugas>({
    deskripsi: tugas?.deskripsi ?? "",
    tenggat: tugas?.tenggat ?? null,
    materi_id: tugas?.materi_id ?? null,
    status: tugas?.status ?? "belum",
    jenjang: tugas?.jenjang ?? "SMP",
    kelas: tugas?.kelas ?? 7,
  });
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
    await onSave(form, tugas?.id);
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-premium p-5 space-y-4 bg-slate-50/50"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <p className="font-bold text-slate-800">
          {tugas ? "Edit Tugas" : "Tambah Tugas Baru"}
        </p>
        <button type="button" onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <textarea
        autoFocus
        value={form.deskripsi}
        onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
        placeholder="Deskripsi tugas (contoh: Kerjakan LKS Hal 10)..."
        required
        rows={3}
        className="input-premium w-full resize-none"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tenggat</label>
          <input
            type="date"
            value={form.tenggat ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, tenggat: e.target.value || null }))}
            className="input-premium w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Materi Terkait</label>
          <select
            value={form.materi_id ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, materi_id: e.target.value || null }))}
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
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tugas ? "Simpan Perubahan" : "Tambahkan Tugas"}
      </button>
    </form>
  );
}
