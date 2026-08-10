import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/db.server";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StatistikChart } from "@/components/dashboard/StatistikChart";
import { JenjangDashboard } from "@/components/dashboard/JenjangDashboard";
import type { Aktivitas } from "@/types";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { data: aktivitas } = await supabase.database.from("aktivitas")
    .select("*")
    .eq("user_id", session.user.id)
    .order("waktu", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-7 shadow-xl shadow-indigo-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NEgwdjJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="relative">
          <p className="text-indigo-200 text-sm font-semibold tracking-wide uppercase mb-1">Selamat datang kembali 👋</p>
          <h1 className="text-3xl font-bold text-white leading-tight">Dashboard</h1>
          <p className="text-indigo-200 text-sm mt-2 max-w-md">
            Pantau perkembangan kegiatan mengajar Anda per jenjang. Pilih jenjang di sidebar untuk memfilter data.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 top-8 w-24 h-24 rounded-full bg-white/5" />
      </div>

      {/* Jenjang Stats */}
      <JenjangDashboard userId={session.user.id} />

      {/* Chart */}
      <section className="card-premium p-6">
        <StatistikChart userId={session.user.id} />
      </section>

      {/* Activity Feed */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-slate-800">Aktivitas Terbaru</h2>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <ActivityFeed aktivitas={(aktivitas as Aktivitas[]) ?? []} />
      </section>
    </div>
  );
}
