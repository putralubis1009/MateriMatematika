"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Camera, FileText } from "lucide-react";
import Link from "next/link";
import type { Materi, FormMateri, Jenjang } from "@/types";
import { ScanUploader } from "./ScanUploader";
import { RumusPickerDialog } from "./RumusPickerDialog";
import { JenjangSelector } from "@/components/ui/JenjangSelector";
import { useJenjang } from "@/components/layout/JenjangProvider";

interface MateriFormPageProps {
  mode: "create" | "edit";
  materi?: Materi;
}

export function MateriFormPage({ mode, materi }: MateriFormPageProps) {
  const router = useRouter();
  const { jenjang: ctxJenjang, kelas: ctxKelas } = useJenjang();
  const [form, setForm] = useState<FormMateri>({
    judul: materi?.judul ?? "",
    isi: materi?.isi ?? "",
    file_foto: materi?.file_foto ?? null,
    jenjang: materi?.jenjang ?? ctxJenjang,
    kelas: materi?.kelas ?? ctxKelas,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScan, setShowScan] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = mode === "create" ? "/api/materi" : `/api/materi/${materi!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Terjadi kesalahan");
      setLoading(false);
      return;
    }

    router.push(mode === "create" ? `/materi/${json.data.id}` : `/materi/${materi!.id}`);
    router.refresh();
  }

  function insertRumus(rumus: string) {
    setForm((f) => ({ ...f, isi: f.isi + "\n" + rumus + "\n" }));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/materi" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === "create" ? "Buat Catatan Baru" : "Edit Catatan"}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Lengkapi form di bawah ini untuk menyimpan materi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl px-5 py-4 flex items-center gap-3 animate-fade-in-up">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            {error}
          </div>
        )}

        {/* Jenjang & Kelas */}
        <div className="card-premium p-6">
          <JenjangSelector
            jenjang={form.jenjang}
            kelas={form.kelas}
            onChange={(j, k) => setForm((f) => ({ ...f, jenjang: j, kelas: k }))}
          />
        </div>

        {/* Judul */}
        <div className="card-premium p-6">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Judul Materi <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.judul}
            onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))}
            placeholder="Contoh: Persamaan Kuadrat Kelas X"
            required
            className="input-premium w-full text-lg font-semibold"
          />
        </div>

        {/* Isi */}
        <div className="card-premium p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest">Isi Catatan</label>
            <div className="flex gap-2">
              <RumusPickerDialog onInsert={insertRumus} />
              <button
                type="button"
                onClick={() => setShowScan(!showScan)}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 px-3 py-2 rounded-lg transition-colors"
              >
                <Camera className="w-4 h-4" />
                Scan Foto
              </button>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={form.isi}
              onChange={(e) => setForm((f) => ({ ...f, isi: e.target.value }))}
              placeholder="Tulis penjelasan, rumus, atau catatan penting di sini..."
              rows={14}
              className="input-premium w-full font-mono text-[14px] leading-relaxed resize-none bg-slate-50/50"
            />
          </div>
        </div>

        {/* Scan Foto */}
        {showScan && (
          <div className="card-premium p-6 animate-fade-in-up border-indigo-100 bg-indigo-50/30">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-500" />
              Scan Foto Materi
            </h3>
            <ScanUploader
              currentUrl={form.file_foto}
              onUpload={(url) => setForm((f) => ({ ...f, file_foto: url }))}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/materi"
            className="sm:w-1/3 flex items-center justify-center py-3.5 text-[15px] font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="sm:flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 transform active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Simpan Catatan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
