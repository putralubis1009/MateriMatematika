import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// PUT /api/kegiatan/[id] — Update kegiatan (tandai selesai / ubah data)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { selesai, nama, tanggal, materi_id } = body;

  const updatePayload: Record<string, unknown> = {};
  if (nama !== undefined) updatePayload.nama = nama;
  if (tanggal !== undefined) updatePayload.tanggal = tanggal;
  if (materi_id !== undefined) updatePayload.materi_id = materi_id;
  if (selesai !== undefined) {
    updatePayload.selesai = selesai;
    updatePayload.selesai_pada = selesai ? new Date().toISOString() : null;
  }

  const { data, error } = await supabase.database.from("kegiatan")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (selesai === true) {
    await supabase.database.from("aktivitas").insert({
      user_id: session.user.id,
      jenis: "selesai_kegiatan",
      deskripsi: `Menyelesaikan kegiatan "${data.nama}"`,
      referensi_id: id,
      referensi_tipe: "kegiatan",
    });
  }

  return NextResponse.json({ data });
}

// DELETE /api/kegiatan/[id]
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase.database.from("kegiatan").delete().eq("id", id).eq("user_id", session.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
