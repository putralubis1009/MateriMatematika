import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/materi/[id]
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase.database.from("materi")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error) return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ data });
}

// PUT /api/materi/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { judul, isi, file_foto } = body;

  if (!judul?.trim()) {
    return NextResponse.json({ error: "Judul tidak boleh kosong" }, { status: 400 });
  }

  const { data, error } = await supabase.database.from("materi")
    .update({ judul: judul.trim(), isi: isi || "", file_foto })
    .eq("id", id)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.database.from("aktivitas").insert({
    user_id: session.user.id,
    jenis: "edit_materi",
    deskripsi: `Mengedit catatan materi "${judul}"`,
    referensi_id: id,
    referensi_tipe: "materi",
  });

  return NextResponse.json({ data });
}

// DELETE /api/materi/[id]
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { data: materi } = await supabase.database.from("materi").select("judul").eq("id", id).eq("user_id", session.user.id).single();

  const { error } = await supabase.database.from("materi").delete().eq("id", id).eq("user_id", session.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (materi) {
    await supabase.database.from("aktivitas").insert({
      user_id: session.user.id,
      jenis: "hapus_materi",
      deskripsi: `Menghapus catatan materi "${materi.judul}"`,
    });
  }

  return NextResponse.json({ success: true });
}
