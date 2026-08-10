"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, CalendarDays, ClipboardList, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useJenjang } from "./JenjangProvider";
import { JENJANG_CONFIG, JENJANG_ORDER } from "@/lib/jenjang";
import type { Jenjang } from "@/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/materi",    label: "Materi",    icon: BookOpen },
  { href: "/jadwal",    label: "Jadwal",    icon: CalendarDays },
  { href: "/tugas",     label: "Tugas",     icon: ClipboardList },
  { href: "/ai",        label: "AI",        icon: Sparkles },
];

const jenjangGradient: Record<Jenjang, string> = {
  SD:  "from-emerald-500 to-teal-500",
  SMP: "from-indigo-500 to-violet-500",
  SMA: "from-violet-500 to-purple-600",
};

export function BottomNav() {
  const pathname = usePathname();
  const { jenjang, kelas, setJenjang, setKelas } = useJenjang();
  const cfg = JENJANG_CONFIG[jenjang];
  const grad = jenjangGradient[jenjang];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50">
      {/* Jenjang strip */}
      <div className="bg-slate-900 border-t border-slate-800 px-3 py-2 flex items-center gap-2">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest shrink-0">Jenjang</span>
        <div className="flex gap-1 flex-1">
          {JENJANG_ORDER.map((j) => {
            const g = jenjangGradient[j];
            return (
              <button
                key={j}
                onClick={() => setJenjang(j)}
                className={cn(
                  "flex-1 py-1 text-[9px] font-bold rounded-md transition-all",
                  jenjang === j
                    ? `bg-gradient-to-r ${g} text-white`
                    : "bg-slate-800 text-slate-500 hover:text-slate-300"
                )}
              >
                {j}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1">
          {cfg.kelas.map((k) => (
            <button
              key={k}
              onClick={() => setKelas(k)}
              className={cn(
                "w-7 h-6 text-[9px] font-bold rounded-md transition-all",
                kelas === k
                  ? `bg-gradient-to-r ${grad} text-white`
                  : "bg-slate-800 text-slate-500"
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="bg-white/90 backdrop-blur-xl border-t border-slate-200/60 shadow-xl">
        <div className="flex items-center justify-around h-[60px] px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                  isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <div className={cn(
                  "w-6 h-6 flex items-center justify-center",
                  isActive && "relative"
                )}>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600" />
                  )}
                </div>
                <span className={cn("text-[10px] font-semibold", isActive ? "text-indigo-600" : "")}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
