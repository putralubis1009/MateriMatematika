import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { JenjangProvider } from "@/components/layout/JenjangProvider";
import { requireAuth } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireAuth();

  return (
    <JenjangProvider>
      <div className="flex h-full min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 p-5 md:p-8 pb-24 md:pb-8 overflow-y-auto">
            <div className="page-content max-w-6xl">
              {children}
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    </JenjangProvider>
  );
}
