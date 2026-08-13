"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";

export function MobileHeader() {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-40 sticky top-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md flex-shrink-0">
          <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-[14px] leading-tight tracking-tight">Kelas MTK Dewi</p>
          <p className="text-[10px] text-slate-500 font-medium">Portal Guru</p>
        </div>
      </div>
      
      <a
        href="/api/auth/signout"
        className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </a>
    </header>
  );
}
