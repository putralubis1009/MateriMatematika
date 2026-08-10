"use client";

import { useState, useEffect } from "react";
import { Sparkles, Send, Loader2, Copy, Check, Download } from "lucide-react";
import jsPDF from "jspdf";
import type { ModeAI } from "@/types";
import { salinKeClipboard, cn } from "@/lib/utils";

const MODES: { value: ModeAI; label: string; placeholder: string; field: string }[] = [
  {
    value: "saran_materi",
    label: "Saran Materi",
    placeholder: "Contoh: Mengajar Aljabar untuk Kelas 8...",
    field: "namaKegiatan",
  },
  {
    value: "tanya_rumus",
    label: "Tanya Rumus",
    placeholder: "Contoh: Rumus luas dan keliling lingkaran...",
    field: "pertanyaan",
  },
  {
    value: "ide_latihan",
    label: "Ide Latihan",
    placeholder: "Contoh: Persamaan linear dua variabel...",
    field: "topikMateri",
  },
];

const MODE_ENDPOINT: Record<ModeAI, string> = {
  saran_materi: "/api/ai/saran-materi",
  tanya_rumus: "/api/ai/tanya-rumus",
  ide_latihan: "/api/ai/ide-latihan",
};

export function AIPage() {
  const [mode, setMode] = useState<ModeAI>("saran_materi");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [jawaban, setJawaban] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentMode = MODES.find((m) => m.value === mode)!;

  useEffect(() => {
    setInput("");
    setJawaban(null);
    setError(null);
    setCopied(false);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setJawaban(null);

    try {
      const body: Record<string, string> = { [currentMode.field]: input };
      const res = await fetch(MODE_ENDPOINT[mode], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Terjadi kesalahan");
      } else {
        setJawaban(json.jawaban);
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!jawaban) return;
    await salinKeClipboard(jawaban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!jawaban) return;
    
    const doc = new jsPDF();
    const margin = 20;
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Rekomendasi AI - ${currentMode.label}`, margin, margin);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    const cleanText = jawaban.replace(/\*\*/g, ""); 
    const lines = doc.splitTextToSize(cleanText, doc.internal.pageSize.width - margin * 2);
    
    let y = margin + 15;
    
    for (let i = 0; i < lines.length; i++) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines[i], margin, y);
      y += 7;
    }
    
    doc.save(`AI-${currentMode.label.replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rekomendasi AI</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Asisten cerdas didukung oleh Gemini</p>
          </div>
        </div>
      </div>

      {/* Tab Mode */}
      <div className="card-premium p-1.5 flex gap-1 bg-white/60 backdrop-blur-md">
        {MODES.map((m) => {
          const isActive = mode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                "flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card-premium p-6 space-y-5 animate-fade-in-up">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest">
            {mode === "saran_materi" ? "Nama Kegiatan / Topik" :
             mode === "tanya_rumus" ? "Pertanyaan Rumus" :
             "Topik Materi untuk Latihan"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentMode.placeholder}
            rows={4}
            required
            className="input-premium w-full text-[15px] leading-relaxed resize-none bg-slate-50/50"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 transform active:scale-[0.98]"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Sedang Berpikir...</>
          ) : (
            <><Send className="w-5 h-5" /> Tanyakan pada AI</>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl px-5 py-4 flex items-center gap-3 animate-fade-in-up">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span className="text-xl">⚠️</span>
          </div>
          {error}
        </div>
      )}

      {/* Jawaban */}
      {jawaban && (
        <div className="card-premium overflow-hidden animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-indigo-100 bg-indigo-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-[15px] font-bold text-indigo-900">Jawaban Gemini AI</p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-100 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PDF
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-100 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm w-[90px] justify-center"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Tersalin" : "Salin"}
              </button>
            </div>
          </div>
          <div className="px-6 py-6 bg-white">
            <div className="prose prose-sm prose-slate max-w-none text-[15px] leading-loose text-slate-700">
              {jawaban.split('\n').map((line, i) => (
                <p key={i} className="mb-2 min-h-[1em]">{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
