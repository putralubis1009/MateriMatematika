import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/kegiatan/riwayat — Kegiatan yang sudah selesai atau tanggal lampau
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase.database.from("kegiatan")
    .select("*, materi(id, judul)")
    .eq("user_id", session.user.id)
    .or(`selesai.eq.true,tanggal.lt.${today}`)
    .order("tanggal", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
