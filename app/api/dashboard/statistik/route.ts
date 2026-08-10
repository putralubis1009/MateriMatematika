import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/dashboard/statistik?range=7 — Data grafik statistik belajar
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const range = parseInt(request.nextUrl.searchParams.get("range") || "7");
  const uid = session.user.id;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - range + 1);
  startDate.setHours(0, 0, 0, 0);

  const [{ data: materi }, { data: kegiatan }] = await Promise.all([
    supabase.database.from("materi")
      .select("dibuat_pada")
      .eq("user_id", uid)
      .gte("dibuat_pada", startDate.toISOString()),
    supabase.database.from("kegiatan")
      .select("selesai_pada")
      .eq("user_id", uid)
      .eq("selesai", true)
      .gte("selesai_pada", startDate.toISOString()),
  ]);

  // Buat data per hari
  const stats: Record<string, { tanggal: string; materi_dibuat: number; kegiatan_selesai: number }> = {};

  for (let i = 0; i < range; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    stats[key] = { tanggal: key, materi_dibuat: 0, kegiatan_selesai: 0 };
  }

  materi?.forEach((m) => {
    const key = m.dibuat_pada.split("T")[0];
    if (stats[key]) stats[key].materi_dibuat++;
  });

  kegiatan?.forEach((k) => {
    if (!k.selesai_pada) return;
    const key = k.selesai_pada.split("T")[0];
    if (stats[key]) stats[key].kegiatan_selesai++;
  });

  return NextResponse.json({ data: Object.values(stats) });
}
