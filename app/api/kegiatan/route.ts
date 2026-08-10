import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/kegiatan?tanggal=YYYY-MM-DD — Kegiatan per tanggal
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tanggal = request.nextUrl.searchParams.get("tanggal");
  const jenjang = request.nextUrl.searchParams.get("jenjang");
  const kelas = request.nextUrl.searchParams.get("kelas");

  let query = supabase.database.from("kegiatan")
    .select("*, materi(id, judul)")
    .eq("user_id", session.user.id)
    .order("dibuat_pada", { ascending: true });

  if (tanggal) query = query.eq("tanggal", tanggal);
  if (jenjang) query = query.eq("jenjang", jenjang);
  if (kelas) query = query.eq("kelas", parseInt(kelas));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/kegiatan — Buat kegiatan baru
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { nama, tanggal, materi_id, jenjang, kelas } = body;

  if (!nama?.trim() || !tanggal) {
    return NextResponse.json({ error: "Nama dan tanggal kegiatan wajib diisi" }, { status: 400 });
  }

  const { data, error } = await supabase.database.from("kegiatan")
    .insert({
      user_id: session.user.id,
      nama: nama.trim(),
      tanggal,
      materi_id: materi_id || null,
      jenjang: jenjang || "SMP",
      kelas: kelas || 7,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.database.from("aktivitas").insert({
    user_id: session.user.id,
    jenis: "buat_kegiatan",
    deskripsi: `Membuat kegiatan "${nama}"`,
    referensi_id: data.id,
    referensi_tipe: "kegiatan",
  });

  return NextResponse.json({ data }, { status: 201 });
}
