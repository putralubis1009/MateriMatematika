"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Sigma,
  Sparkles,
  LogOut,
  GraduationCap,
  ChevronRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useJenjang } from "./JenjangProvider";
import { JENJANG_CONFIG, JENJANG_ORDER } from "@/lib/jenjang";
import type { Jenjang } from "@/types";
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Ringkasan & statistik" },
  { href: "/materi", label: "Materi", icon: BookOpen, desc: "Catatan materi ajar" },
  { href: "/jadwal", label: "Jadwal", icon: CalendarDays, desc: "Checklist kegiatan" },
  { href: "/tugas", label: "Tugas Siswa", icon: ClipboardList, desc: "Daftar & status tugas" },
  { href: "/murid", label: "Daftar Murid", icon: Users, desc: "Kelola data & akses murid" },
  { href: "/rumus", label: "Pustaka Rumus", icon: Sigma, desc: "Bank rumus matematika" },
  { href: "/ai", label: "Rekomendasi AI", icon: Sparkles, desc: "Saran berbasis AI" },
];

const jenjangMeta: Record<Jenjang, { gradient: string; ring: string; glow: string }> = {
  SD: { gradient: "from-emerald-500 to-teal-500", ring: "ring-emerald-500/30", glow: "shadow-emerald-500/25" },
  SMP: { gradient: "from-indigo-500 to-violet-500", ring: "ring-indigo-500/30", glow: "shadow-indigo-500/25" },
  SMA: { gradient: "from-violet-500 to-purple-600", ring: "ring-violet-500/30", glow: "shadow-violet-500/25" },
};

export function Sidebar() {
  const pathname = usePathname();
  const { jenjang, kelas, setJenjang, setKelas } = useJenjang();
  
  // Safe fallbacks in case jenjang is invalid
  const cfg = JENJANG_CONFIG[jenjang] || JENJANG_CONFIG['SMP'];
  const meta = jenjangMeta[jenjang] || jenjangMeta['SMP'];



  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-900 h-screen sticky top-0 border-r border-slate-800 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 pointer-events-none" />

      <div className="relative flex flex-col h-full">
        {/* ── Logo ── */}
        <div className="flex items-center gap-3.5 px-6 py-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-[15px] leading-tight tracking-tight">Kelas MTK Dewi</p>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">Platform Guru Matematika</p>
          </div>
        </div>

        {/* ── Jenjang Selector ── */}
        <div className="px-4 py-4 border-b border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">Jenjang Aktif</p>

          {/* Jenjang tabs */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {JENJANG_ORDER.map((j) => {
              const m = jenjangMeta[j];
              const isActive = jenjang === j;
              return (
                <button
                  key={j}
                  onClick={() => setJenjang(j)}
                  className={cn(
                    "py-2 text-xs font-bold rounded-lg transition-all duration-200",
                    isActive
                      ? `bg-gradient-to-r ${m.gradient} text-white shadow-md ${m.glow}`
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  )}
                >
                  {j}
                </button>
              );
            })}
          </div>

          {/* Kelas pills */}
          <div className="flex gap-1.5">
            {cfg.kelas.map((k) => (
              <button
                key={k}
                onClick={() => setKelas(k)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ring-1",
                  kelas === k
                    ? `bg-gradient-to-r ${meta.gradient} text-white ring-transparent shadow-sm`
                    : "bg-slate-800 text-slate-400 ring-slate-700 hover:ring-slate-600 hover:text-slate-300"
                )}
              >
                Kls {k}
              </button>
            ))}
          </div>

          {/* Active indicator */}
          <div className={cn(
            "mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg ring-1",
            meta.ring,
            "bg-slate-800/60"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", meta.gradient)} />
            <span className="text-[11px] font-semibold text-slate-300">
              {jenjang} · Kelas {kelas}
            </span>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto sidebar-scroll">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 px-3 pt-1">Menu</p>
          {navItems.map(({ href, label, icon: Icon, desc }) => {
            const isActive = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                  isActive
                    ? "nav-active-glow text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                  isActive
                    ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/30"
                    : "bg-slate-800 group-hover:bg-slate-700"
                )}>
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-semibold leading-tight text-sm", isActive ? "text-white" : "")}>{label}</p>
                  <p className="text-[11px] text-slate-600 leading-none mt-0.5 truncate">{desc}</p>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* ── Logout ── */}
        <div className="px-3 py-4 border-t border-slate-800">
          <a
            href="/api/auth/signout"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-red-500/10 flex items-center justify-center transition-all">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium">Keluar</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
