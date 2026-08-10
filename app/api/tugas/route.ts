import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/tugas?status=belum — Daftar tugas (opsional filter status)
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = request.nextUrl.searchParams.get("status");
  const jenjang = request.nextUrl.searchParams.get("jenjang");
  const kelas = request.nextUrl.searchParams.get("kelas");

  let query = supabase.database.from("tugas")
    .select("*, materi(id, judul)")
    .eq("user_id", session.user.id)
    .order("tenggat", { ascending: true, nullsFirst: false });

  if (status) query = query.eq("status", status);
  if (jenjang) query = query.eq("jenjang", jenjang);
  if (kelas) query = query.eq("kelas", parseInt(kelas));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/tugas — Buat tugas baru
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { deskripsi, tenggat, materi_id, status, jenjang, kelas } = body;

  if (!deskripsi?.trim()) {
    return NextResponse.json({ error: "Deskripsi tugas tidak boleh kosong" }, { status: 400 });
  }

  const { data, error } = await supabase.database.from("tugas")
    .insert({
      user_id: session.user.id,
      deskripsi: deskripsi.trim(),
      tenggat: tenggat || null,
      materi_id: materi_id || null,
      status: status || "belum",
      jenjang: jenjang || "SMP",
      kelas: kelas || 7,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.database.from("aktivitas").insert({
    user_id: session.user.id,
    jenis: "tambah_tugas",
    deskripsi: `Menambahkan tugas: "${deskripsi.slice(0, 50)}"`,
    referensi_id: data.id,
    referensi_tipe: "tugas",
  });

  return NextResponse.json({ data }, { status: 201 });
}
