"use client";

import { useMemo } from "react";
import "katex/dist/katex.min.css";
// @ts-ignore
import { InlineMath, BlockMath } from "react-katex";
import { BookOpen, Camera, ArrowLeft } from "lucide-react";

interface MateriDetailViewProps {
  materi: {
    id: string;
    judul: string;
    isi: string;
    file_foto?: string | null;
    jenjang?: string;
    kelas?: number;
    diperbarui_pada: string;
  };
  onClose: () => void;
}

// Parsing teks untuk merender LaTeX inline ($...$) dan block ($$...$$)
function renderWithLatex(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Split by block math first ($$...$$)
  const blockSplit = text.split(/(\\$\\$[\s\S]*?\\$\\$|\$\$[\s\S]*?\$\$)/g);

  blockSplit.forEach((segment, bi) => {
    const blockMatch = segment.match(/^\$\$([\s\S]*?)\$\$$/);
    if (blockMatch) {
      parts.push(
        <div key={`block-${bi}`} className="my-4 text-center">
          <BlockMath math={blockMatch[1].trim()} />
        </div>
      );
      return;
    }

    // Split by inline math ($...$)
    const inlineSplit = segment.split(/(\$[^$\n]+?\$)/g);
    inlineSplit.forEach((chunk, ci) => {
      const inlineMatch = chunk.match(/^\$([^$\n]+?)\$$/);
      if (inlineMatch) {
        parts.push(
          <InlineMath key={`inline-${bi}-${ci}`} math={inlineMatch[1]} />
        );
      } else if (chunk) {
        // Render teks biasa, dengan deteksi pemisah "Cara Konsep" dan "Cara Cepat"
        const lines = chunk.split("\n");
        lines.forEach((line, li) => {
          const isKonsepHeader = /cara\s+konsep\s+dasar/i.test(line);
          const isCepatHeader = /cara\s+cepat|the\s+king/i.test(line);

          if (isKonsepHeader) {
            parts.push(
              <div key={`konsep-${bi}-${ci}-${li}`} className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-blue-200" />
                <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full">
                  📘 Cara Konsep Dasar
                </span>
                <div className="flex-1 h-px bg-blue-200" />
              </div>
            );
          } else if (isCepatHeader) {
            parts.push(
              <div key={`cepat-${bi}-${ci}-${li}`} className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-amber-200" />
                <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black uppercase tracking-widest rounded-full">
                  ⚡ Cara Cepat / The King
                </span>
                <div className="flex-1 h-px bg-amber-200" />
              </div>
            );
          } else if (line.trim()) {
            parts.push(
              <span key={`text-${bi}-${ci}-${li}`}>
                {li > 0 && <br />}
                {line}
              </span>
            );
          } else if (li > 0) {
            parts.push(<br key={`br-${bi}-${ci}-${li}`} />);
          }
        });
      }
    });
  });

  return parts;
}

export function MateriDetailView({ materi, onClose }: MateriDetailViewProps) {
  const rendered = useMemo(() => renderWithLatex(materi.isi || ""), [materi.isi]);

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Back button */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-200 px-4 py-2 rounded-xl transition-all shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar
      </button>

      {/* Header card */}
      <div className="card-premium p-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {materi.jenjang && (
                <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full">
                  {materi.jenjang} · Kelas {materi.kelas}
                </span>
              )}
              <span className="text-xs text-slate-400 font-medium">
                {new Date(materi.diperbarui_pada).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">{materi.judul}</h2>
          </div>
        </div>
      </div>

      {/* Foto scan jika ada */}
      {materi.file_foto && (
        <div className="card-premium overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Camera className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Foto Scan</span>
          </div>
          <div className="p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={materi.file_foto} alt="Foto scan materi" className="w-full max-h-[500px] object-contain rounded-lg" />
          </div>
        </div>
      )}

      {/* Isi Materi dengan LaTeX */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Isi Materi</h3>
        </div>
        <div className="text-[15px] leading-loose text-slate-800 font-medium">
          {materi.isi ? (
            <div className="space-y-1">
              {rendered}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-slate-400">
              <BookOpen className="w-8 h-8 mb-2 opacity-20" />
              <span className="text-sm italic">Tidak ada isi catatan.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
