import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/materi?q=keyword — Daftar materi (dengan search opsional)
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q");
  const jenjang = request.nextUrl.searchParams.get("jenjang");
  const kelas = request.nextUrl.searchParams.get("kelas");

  let query = supabase.database.from("materi")
    .select("*")
    .eq("user_id", session.user.id)
    .order("diperbarui_pada", { ascending: false });

  if (q) query = query.ilike("judul", `%${q}%`);
  if (jenjang) query = query.eq("jenjang", jenjang);
  if (kelas) query = query.eq("kelas", parseInt(kelas));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

// POST /api/materi — Buat catatan materi baru
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { judul, isi, file_foto, jenjang, kelas } = body;

  if (!judul?.trim()) {
    return NextResponse.json({ error: "Judul tidak boleh kosong" }, { status: 400 });
  }

  const { data, error } = await supabase.database.from("materi")
    .insert({
      user_id: session.user.id,
      judul: judul.trim(),
      isi: isi || "",
      file_foto,
      jenjang: jenjang || "SMP",
      kelas: kelas || 7,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Catat aktivitas
  await supabase.database.from("aktivitas").insert({
    user_id: session.user.id,
    jenis: "buat_materi",
    deskripsi: `Membuat catatan materi "${judul}"`,
    referensi_id: data.id,
    referensi_tipe: "materi",
  });

  return NextResponse.json({ data }, { status: 201 });
}
