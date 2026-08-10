import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";
import { callGemini, promptIdeLatihan, SYSTEM_GURU_MATEMATIKA } from "@/lib/gemini";

// POST /api/ai/ide-latihan
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topikMateri, model } = await request.json();
  if (!topikMateri?.trim()) {
    return NextResponse.json({ error: "Topik materi tidak boleh kosong" }, { status: 400 });
  }

  const { text, error } = await callGemini({
    model,
    prompt: promptIdeLatihan(topikMateri),
    systemInstruction: SYSTEM_GURU_MATEMATIKA,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  await supabase.database.from("log_ai").insert({
    user_id: session.user.id,
    mode: "ide_latihan",
    pertanyaan: topikMateri,
    jawaban: text,
  });

  await supabase.database.from("aktivitas").insert({
    user_id: session.user.id,
    jenis: "tanya_ai",
    deskripsi: `Meminta ide latihan untuk topik "${topikMateri}"`,
    referensi_tipe: "ai",
  });

  return NextResponse.json({ jawaban: text });
}
