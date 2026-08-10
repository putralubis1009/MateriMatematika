import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// PUT /api/tugas/[id] — Update tugas (status, deskripsi, tenggat)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { deskripsi, tenggat, materi_id, status } = body;

  const updatePayload: Record<string, unknown> = {};
  if (deskripsi !== undefined) updatePayload.deskripsi = deskripsi;
  if (tenggat !== undefined) updatePayload.tenggat = tenggat;
  if (materi_id !== undefined) updatePayload.materi_id = materi_id;
  if (status !== undefined) updatePayload.status = status;

  const { data, error } = await supabase.database.from("tugas")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status) {
    await supabase.database.from("aktivitas").insert({
      user_id: session.user.id,
      jenis: "update_status_tugas",
      deskripsi: `Memperbarui status tugas menjadi "${status}"`,
      referensi_id: id,
      referensi_tipe: "tugas",
    });
  }

  return NextResponse.json({ data });
}

// DELETE /api/tugas/[id]
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase.database.from("tugas").delete().eq("id", id).eq("user_id", session.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
