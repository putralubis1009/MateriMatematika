"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap, Mail, Lock, Loader2, User, KeyRound,
  ChevronRight, BookOpen, ArrowLeft
} from "lucide-react";
import { loginAction } from "./actions";
import { studentLoginAction } from "./student-actions";

export default function LoginPage() {
  const [isStudentView, setIsStudentView] = useState(false);
  const router = useRouter();

  // State guru
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State murid
  const [namaLengkap, setNamaLengkap] = useState("");
  const [kodeAkses, setKodeAkses] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function switchToStudent() {
    setError(null);
    setIsStudentView(true);
  }

  function switchToGuru() {
    setError(null);
    setIsStudentView(false);
  }

  async function handleGuruLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const result = await loginAction(formData);
      if (result.error) {
        const msg =
          result.error === "Email not confirmed"
            ? "Email belum dikonfirmasi. Cek kotak masuk email kamu."
            : result.error === "Invalid login credentials"
            ? "Email atau kata sandi salah. Pastikan sudah benar."
            : `Gagal login: ${result.error}`;
        setError(msg);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setLoading(false);
    }
  }

  async function handleStudentLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("nama_lengkap", namaLengkap);
      formData.append("kode_akses", kodeAkses);
      const result = await studentLoginAction(formData);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.push("/student-dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'white\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e")'}} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-5 shadow-2xl shadow-indigo-500/40">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Kelas MTK Dewi
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            {isStudentView ? "Portal Belajar Murid" : "Asisten Digital Guru Matematika"}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/40 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          {/* Mode Tabs */}
          <div className="flex rounded-2xl bg-white/5 p-1 mb-7 border border-white/10">
            <button
              type="button"
              onClick={switchToGuru}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                !isStudentView
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Guru
            </button>
            <button
              type="button"
              onClick={switchToStudent}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                isStudentView
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Murid
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl px-4 py-3 animate-fade-in-up">
              ⚠️ {error}
            </div>
          )}

          {/* ─── FORM GURU ─── */}
          {!isStudentView && (
            <form onSubmit={handleGuruLogin} className="space-y-4 animate-fade-in-up">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guru@sekolah.sch.id"
                    required
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-guru-login"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ─── FORM MURID ─── */}
          {isStudentView && (
            <form onSubmit={handleStudentLogin} className="space-y-4 animate-fade-in-up">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3 mb-2">
                <p className="text-xs text-indigo-300 font-medium">
                  📚 Masukkan nama lengkap dan kode akses yang diberikan gurumu.
                </p>
              </div>

              <div>
                <label htmlFor="nama_lengkap" className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="nama_lengkap"
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Nama lengkapmu sesuai data guru"
                    required
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="kode_akses" className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                  Kode Akses (PIN)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="kode_akses"
                    type="text"
                    value={kodeAkses}
                    onChange={(e) => setKodeAkses(e.target.value.toUpperCase())}
                    placeholder="Contoh: MTK-2026-A1"
                    required
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-murid-login"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-indigo-500/30 active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    Masuk Kelas
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2026 Kelas MTK Dewi
        </p>
      </div>
    </div>
  );
}
