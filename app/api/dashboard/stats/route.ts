import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";
import { JENJANG_ORDER } from "@/lib/jenjang";

// GET /api/dashboard/stats — Statistik per jenjang
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = await Promise.all(
    JENJANG_ORDER.map(async (jenjang) => {
      const [
        { count: materi },
        { count: kegiatan },
        { count: kegiatanSelesai },
        { count: tugas },
        { count: tugasSelesai },
      ] = await Promise.all([
        supabase.database.from("materi").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("jenjang", jenjang),
        supabase.database.from("kegiatan").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("jenjang", jenjang),
        supabase.database.from("kegiatan").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("jenjang", jenjang).eq("selesai", true),
        supabase.database.from("tugas").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("jenjang", jenjang),
        supabase.database.from("tugas").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("jenjang", jenjang).eq("status", "selesai_dinilai"),
      ]);

      return {
        jenjang,
        materi: materi ?? 0,
        kegiatan: kegiatan ?? 0,
        kegiatanSelesai: kegiatanSelesai ?? 0,
        tugas: tugas ?? 0,
        tugasSelesai: tugasSelesai ?? 0,
      };
    })
  );

  return NextResponse.json({ stats });
}
