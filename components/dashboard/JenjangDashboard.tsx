"use client";

import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, ClipboardList, TrendingUp, CheckCircle2 } from "lucide-react";
import { useJenjang } from "@/components/layout/JenjangProvider";
import { JENJANG_ORDER, JENJANG_CONFIG } from "@/lib/jenjang";
import type { Jenjang } from "@/types";
import { cn } from "@/lib/utils";

interface JenjangStat {
  jenjang: Jenjang;
  materi: number;
  kegiatan: number;
  kegiatanSelesai: number;
  tugas: number;
  tugasSelesai: number;
}

const jenjangStyle: Record<Jenjang, {
  gradient: string; lightBg: string; border: string; text: string; icon: string; glow: string;
}> = {
  SD:  {
    gradient: "from-emerald-500 to-teal-500",
    lightBg: "bg-emerald-50", border: "border-emerald-100",
    text: "text-emerald-700", icon: "bg-emerald-100 text-emerald-600", glow: "shadow-emerald-100"
  },
  SMP: {
    gradient: "from-indigo-500 to-violet-500",
    lightBg: "bg-indigo-50",  border: "border-indigo-100",
    text: "text-indigo-700",  icon: "bg-indigo-100 text-indigo-600",  glow: "shadow-indigo-100"
  },
  SMA: {
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",  border: "border-violet-100",
    text: "text-violet-700",  icon: "bg-violet-100 text-violet-600",  glow: "shadow-violet-100"
  },
};

export function JenjangDashboard({ userId }: { userId: string }) {
  const { jenjang: activeJenjang, kelas: activeKelas } = useJenjang();
  const [stats, setStats] = useState<JenjangStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data.stats ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const active = stats.find((s) => s.jenjang === activeJenjang);
  const style = jenjangStyle[activeJenjang];
  const cfg = JENJANG_CONFIG[activeJenjang];

  const cards = [
    {
      icon: BookOpen,
      label: "Total Materi",
      value: active?.materi ?? 0,
      sub: "catatan materi ajar",
      color: "blue" as const,
    },
    {
      icon: CalendarDays,
      label: "Kegiatan",
      value: active?.kegiatan ?? 0,
      sub: `${active?.kegiatanSelesai ?? 0} selesai`,
      progress: active && active.kegiatan > 0 ? (active.kegiatanSelesai / active.kegiatan) : 0,
      color: "green" as const,
    },
    {
      icon: ClipboardList,
      label: "Tugas Siswa",
      value: active?.tugas ?? 0,
      sub: `${active?.tugasSelesai ?? 0} selesai dinilai`,
      progress: active && active.tugas > 0 ? (active.tugasSelesai / active.tugas) : 0,
      color: "purple" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Active Jenjang Header */}
      <div className={cn(
        "rounded-xl p-4 border flex items-center gap-4",
        style.lightBg, style.border
      )}>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shadow-sm", `bg-gradient-to-br ${style.gradient}`, "text-white")}>
          {activeJenjang}
        </div>
        <div>
          <p className={cn("font-bold text-base", style.text)}>{activeJenjang} · Kelas {activeKelas}</p>
          <p className="text-xs text-slate-500">Kelas {cfg.kelas.join(', ')} · Menampilkan data untuk jenjang ini</p>
        </div>
        <div className="ml-auto">
          <TrendingUp className={cn("w-5 h-5", style.text, "opacity-50")} />
        </div>
      </div>

      {/* 3 Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-36 rounded-2xl shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <StatCard key={i} {...c} jenjangStyle={style} animDelay={i * 0.05} />
          ))}
        </div>
      )}

      {/* All Jenjang Summary */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-bold text-slate-700">Semua Jenjang</h3>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {JENJANG_ORDER.map((j) => {
            const s = stats.find(x => x.jenjang === j);
            const st = jenjangStyle[j];
            const isActive = j === activeJenjang;
            return (
              <div
                key={j}
                className={cn(
                  "rounded-xl p-4 border transition-all",
                  isActive ? `${st.lightBg} ${st.border} shadow-sm ${st.glow}` : "bg-white border-slate-100"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-md",
                    isActive ? `bg-gradient-to-r ${st.gradient} text-white` : "bg-slate-100 text-slate-500"
                  )}>
                    {j}
                  </span>
                  {isActive && <CheckCircle2 className={cn("w-4 h-4", st.text)} />}
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Materi",   val: s?.materi ?? 0 },
                    { label: "Kegiatan", val: s?.kegiatan ?? 0 },
                    { label: "Tugas",    val: s?.tugas ?? 0 },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p className={cn("text-xl font-bold", isActive ? st.text : "text-slate-700")}>{val}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const statColors = {
  blue:   { bg: "bg-blue-500/10",   text: "text-blue-600",   num: "text-blue-700",   bar: "bg-blue-500" },
  green:  { bg: "bg-emerald-500/10",text: "text-emerald-600",num: "text-emerald-700", bar: "bg-emerald-500" },
  purple: { bg: "bg-violet-500/10", text: "text-violet-600", num: "text-violet-700",  bar: "bg-violet-500" },
};

function StatCard({
  icon: Icon, label, value, sub, progress, color, jenjangStyle: js, animDelay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  sub?: string;
  progress?: number;
  color: keyof typeof statColors;
  jenjangStyle: typeof jenjangStyle[Jenjang];
  animDelay: number;
}) {
  const c = statColors[color];
  return (
    <div
      className="card-premium p-5"
      style={{ animationDelay: `${animDelay}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", c.bg)}>
          <Icon className={cn("w-5 h-5", c.text)} />
        </div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className={cn("text-3xl font-black", c.num)}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      {progress !== undefined && value > 0 && (
        <div className="mt-4">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", c.bar)}
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{Math.round(progress * 100)}% selesai</p>
        </div>
      )}
    </div>
  );
}
