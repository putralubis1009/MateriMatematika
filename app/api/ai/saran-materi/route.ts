import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";
import { callGemini, promptSaranMateri, SYSTEM_GURU_MATEMATIKA } from "@/lib/gemini";

// POST /api/ai/saran-materi
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { namaKegiatan, model } = await request.json();
  if (!namaKegiatan?.trim()) {
    return NextResponse.json({ error: "Nama kegiatan tidak boleh kosong" }, { status: 400 });
  }

  const { text, error } = await callGemini({
    model,
    prompt: promptSaranMateri(namaKegiatan),
    systemInstruction: SYSTEM_GURU_MATEMATIKA,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  // Simpan ke log_ai
  await supabase.database.from("log_ai").insert({
    user_id: session.user.id,
    mode: "saran_materi",
    pertanyaan: namaKegiatan,
    jawaban: text,
  });

  await supabase.database.from("aktivitas").insert({
    user_id: session.user.id,
    jenis: "tanya_ai",
    deskripsi: `Meminta saran materi untuk "${namaKegiatan}"`,
    referensi_tipe: "ai",
  });

  return NextResponse.json({ jawaban: text });
}
