import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Edit, Download, ArrowLeft, BookOpen, Camera, Calendar } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/db.server";
import { formatTanggal } from "@/lib/utils";
import type { Materi } from "@/types";
import { JenjangBadge } from "@/components/ui/JenjangBadge";

export const metadata: Metadata = { title: "Detail Materi" };

export default async function MateriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const { data: materi } = await supabase.database.from("materi")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (!materi) notFound();

  const m = materi as Materi;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link 
          href="/materi" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Header */}
      <div className="card-premium p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              {m.jenjang && <JenjangBadge jenjang={m.jenjang} kelas={m.kelas} size="sm" />}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              {m.judul}
            </h1>
            
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
              <Calendar className="w-4 h-4 text-slate-400" />
              Diperbarui: {formatTanggal(m.diperbarui_pada)}
            </div>
          </div>
          
          <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
            <Link
              href={`/materi/${id}/edit`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <a
              href={`/api/materi/${id}/pdf`}
              target="_blank"
              className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 px-4 py-2.5 shadow-md shadow-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              Unduh PDF
            </a>
          </div>
        </div>
      </div>

      {/* Foto Scan (jika ada) */}
      {m.file_foto && (
        <div className="card-premium overflow-hidden animate-fade-in-up">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Camera className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Foto Scan</p>
          </div>
          <div className="p-2 bg-slate-100/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.file_foto} alt="Foto scan materi" className="w-full object-contain max-h-[500px] rounded-lg" />
          </div>
        </div>
      )}

      {/* Isi Materi */}
      <div className="card-premium p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Isi Materi</h2>
        </div>
        
        <div className="prose prose-sm prose-slate max-w-none text-[15px] leading-loose text-slate-800 whitespace-pre-wrap font-medium">
          {m.isi ? (
            m.isi
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <BookOpen className="w-8 h-8 mb-3 opacity-20" />
              <span className="italic font-normal">Tidak ada isi catatan.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
