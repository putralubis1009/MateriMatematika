import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";
import { callGemini, promptTanyaRumus, SYSTEM_GURU_MATEMATIKA } from "@/lib/gemini";

// POST /api/ai/tanya-rumus
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pertanyaan, model } = await request.json();
  if (!pertanyaan?.trim()) {
    return NextResponse.json({ error: "Pertanyaan tidak boleh kosong" }, { status: 400 });
  }

  const { text, error } = await callGemini({
    model,
    prompt: promptTanyaRumus(pertanyaan),
    systemInstruction: SYSTEM_GURU_MATEMATIKA,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  await supabase.database.from("log_ai").insert({
    user_id: session.user.id,
    mode: "tanya_rumus",
    pertanyaan,
    jawaban: text,
  });

  await supabase.database.from("aktivitas").insert({
    user_id: session.user.id,
    jenis: "tanya_ai",
    deskripsi: `Tanya rumus: "${pertanyaan.slice(0, 60)}"`,
    referensi_tipe: "ai",
  });

  return NextResponse.json({ jawaban: text });
}
