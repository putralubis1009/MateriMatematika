import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/dashboard/ringkasan
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = session.user.id;

  const [
    { count: totalMateri },
    { count: totalKegiatan },
    { count: kegiatanSelesai },
    { count: totalTugas },
    { count: tugasSelesai },
  ] = await Promise.all([
    supabase.database.from("materi").select("*", { count: "exact", head: true }).eq("user_id", uid),
    supabase.database.from("kegiatan").select("*", { count: "exact", head: true }).eq("user_id", uid),
    supabase.database.from("kegiatan").select("*", { count: "exact", head: true }).eq("user_id", uid).eq("selesai", true),
    supabase.database.from("tugas").select("*", { count: "exact", head: true }).eq("user_id", uid),
    supabase.database.from("tugas").select("*", { count: "exact", head: true }).eq("user_id", uid).eq("status", "selesai_dinilai"),
  ]);

  return NextResponse.json({
    data: {
      total_materi: totalMateri ?? 0,
      total_kegiatan: totalKegiatan ?? 0,
      kegiatan_selesai: kegiatanSelesai ?? 0,
      total_tugas: totalTugas ?? 0,
      tugas_selesai: tugasSelesai ?? 0,
    },
  });
}
