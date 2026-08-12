"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, ClipboardList, BookOpen,
  LogOut, Loader2, Menu, X
} from "lucide-react";

const navItems = [
  { href: "/student-dashboard/soal", label: "Daftar Soal", icon: ClipboardList },
  { href: "/student-dashboard/materi", label: "History Pelajaran", icon: BookOpen },
];

export function StudentLayoutClient({
  children,
  muridNama,
  muridJenjang,
  muridKelas,
}: {
  children: React.ReactNode;
  muridNama: string;
  muridJenjang: string;
  muridKelas: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/student/logout", { method: "POST" });
    } catch {}
    // Use window.location for full browser reload so server-side layout
    // re-reads cookies and doesn't redirect back to student dashboard
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none">Portal Murid</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{muridJenjang} Kelas {muridKelas}</p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right: user + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">{muridNama.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xs font-bold text-indigo-700 max-w-[120px] truncate">{muridNama}</span>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 px-3 py-2 rounded-xl transition-all duration-200"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Keluar</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-500"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-1 bg-white animate-fade-in-up">
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">{muridNama.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-bold text-slate-700">{muridNama}</span>
              <span className="ml-auto text-xs text-slate-400">{muridJenjang} Kls {muridKelas}</span>
            </div>
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
