"use client";

import { useState, useEffect } from "react";
import { Plus, ClipboardList } from "lucide-react";
import type { Tugas, StatusTugasType, FormTugas } from "@/types";
import { TugasCard } from "./TugasCard";
import { TugasForm } from "./TugasForm";
import { useJenjang } from "@/components/layout/JenjangProvider";
import { JENJANG_CONFIG } from "@/lib/jenjang";
import { cn } from "@/lib/utils";

export function TugasPage() {
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTugas, setEditTugas] = useState<Tugas | null>(null);
  const { jenjang, kelas } = useJenjang();
  const cfg = JENJANG_CONFIG[jenjang];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tugas?jenjang=${jenjang}&kelas=${kelas}`)
      .then((r) => r.json())
      .then(({ data }) => { setTugas(data ?? []); setLoading(false); });
  }, [jenjang, kelas]);

  async function handleUpdateStatus(id: string, status: StatusTugasType) {
    const res = await fetch(`/api/tugas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const { data } = await res.json();
    setTugas((prev) => prev.map((t) => (t.id === id ? data : t)));
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tugas/${id}`, { method: "DELETE" });
    setTugas((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleSave(form: FormTugas, id?: string) {
    if (id) {
      const res = await fetch(`/api/tugas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { data } = await res.json();
      setTugas((prev) => prev.map((t) => (t.id === id ? data : t)));
    } else {
      const res = await fetch("/api/tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, jenjang, kelas }),
      });
      const { data } = await res.json();
      setTugas((prev) => [data, ...prev]);
    }
    setShowForm(false);
    setEditTugas(null);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Tugas Siswa</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md", cfg.bgColor, cfg.color)}>
              {jenjang}
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Kelas {kelas}
            </span>
          </div>
        </div>
        <button
          onClick={() => { setEditTugas(null); setShowForm(true); }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Tugas
        </button>
      </div>

      {showForm && (
        <div className="animate-fade-in-up">
          <TugasForm
            tugas={editTugas ?? undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditTugas(null); }}
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 rounded-xl shimmer" />)}
        </div>
      ) : tugas.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-indigo-300" />
          </div>
          <p className="text-slate-500 font-medium">Belum ada tugas untuk {jenjang} Kelas {kelas}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tugas.map((t, i) => (
            <div key={t.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <TugasCard
                tugas={t}
                onUpdateStatus={handleUpdateStatus}
                onEdit={() => { setEditTugas(t); setShowForm(true); }}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
