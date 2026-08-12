"use client";

import { useState, useEffect } from "react";
import { 
  GraduationCap, Plus, Search, Trash2, KeyRound, 
  Copy, CheckCircle2, Loader2, UserPlus, AlertCircle
} from "lucide-react";
import { useJenjang } from "@/components/layout/JenjangProvider";
import { cn } from "@/lib/utils";
import type { Murid } from "@/types";

export function MuridList() {
  const { jenjang, kelas } = useJenjang();
  
  const [murid, setMurid] = useState<Murid[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // State for Add Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newNama, setNewNama] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function loadMurid() {
    setLoading(true);
    try {
      const res = await fetch(`/api/murid?jenjang=${jenjang}&kelas=${kelas}`);
      const json = await res.json();
      if (json.data) {
        setMurid(json.data);
      }
    } catch (err) {
      console.error("Gagal load murid", err);
    } finally {
      setLoading(false);
    }
  }

  // Load murid when jenjang or kelas changes
  useEffect(() => {
    loadMurid();
  }, [jenjang, kelas]);

  async function handleAddMurid(e: React.FormEvent) {
    e.preventDefault();
    if (!newNama.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/murid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: newNama.trim(),
          jenjang,
          kelas
        })
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);
      
      // If data is somehow missing from response, fetch all students again
      if (json.data) {
        setMurid(prev => [json.data, ...prev]);
      } else {
        await loadMurid();
      }
      
      setIsAddOpen(false);
      setNewNama("");
    } catch (err: any) {
      setError(err.message || "Gagal menambah murid");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus murid ini? Mereka tidak akan bisa login lagi.")) return;
    
    // Optimistic UI update
    const prev = [...murid];
    setMurid(murid.filter(m => m.id !== id));
    
    try {
      const res = await fetch(`/api/murid/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
    } catch (err) {
      console.error("Gagal hapus murid", err);
      alert("Gagal menghapus murid.");
      setMurid(prev); // Revert
    }
  }

  function handleCopyPin(pin: string, id: string) {
    navigator.clipboard.writeText(pin);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredMurid = murid.filter(m => {
    if (!m) return false;
    const searchLower = search.toLowerCase();
    const matchNama = m.nama_lengkap?.toLowerCase().includes(searchLower) || false;
    const matchKode = m.kode_akses?.toLowerCase().includes(searchLower) || false;
    return matchNama || matchKode;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kelola Murid</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manajemen akses siswa untuk {jenjang} Kelas {kelas}
          </p>
        </div>
        <button
          onClick={() => {
            setError(null);
            setNewNama("");
            setIsAddOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-500/25 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Murid
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau PIN murid..."
          className="input-premium w-full pl-11"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Memuat data murid...</p>
        </div>
      ) : filteredMurid.length === 0 ? (
        <div className="card-premium p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-semibold">
            {search ? `Tidak ada murid dengan pencarian "${search}"` : "Belum ada murid di kelas ini."}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Klik tombol Tambah Murid untuk mendaftarkan mereka.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMurid.map((m, i) => (
            <div 
              key={m.id} 
              className="card-premium p-5 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up group relative overflow-hidden"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {/* Delete button (shows on hover) */}
              <button 
                onClick={() => handleDelete(m.id)}
                className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Hapus Murid"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-4 pr-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shrink-0 border border-indigo-200/50 shadow-inner">
                  <span className="text-lg font-black text-indigo-600">
                    {m.nama_lengkap.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-[15px] truncate" title={m.nama_lengkap}>
                    {m.nama_lengkap}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Ditambahkan {new Date(m.dibuat_pada).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              {/* PIN Box */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3 group/pin">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-indigo-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">PIN Akses</p>
                    <p className="text-sm font-mono font-bold tracking-widest text-slate-700">
                      {m.kode_akses}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyPin(m.kode_akses, m.id)}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200 border",
                    copiedId === m.id 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" 
                      : "bg-white text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm group-hover/pin:shadow"
                  )}
                  title="Copy PIN"
                >
                  {copiedId === m.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Tambah Murid Baru</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-lg transition-colors border border-slate-200"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleAddMurid} className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={newNama}
                    onChange={(e) => setNewNama(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="input-premium w-full"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    Murid ini akan didaftarkan ke jenjang <span className="font-bold text-indigo-600">{jenjang} Kelas {kelas}</span>.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newNama.trim()}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Murid"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
