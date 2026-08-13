import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API Key tidak dikonfigurasi" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) {
      return NextResponse.json({ error: "Gagal mengambil daftar model" }, { status: 500 });
    }

    const data = await res.json();
    
    // Filter model yang mendukung "generateContent" dan namanya mengandung "gemini"
    const availableModels = data.models
      .filter((m: any) => m.name.includes("gemini") && m.supportedGenerationMethods.includes("generateContent"))
      .map((m: any) => ({
        id: m.name.replace("models/", ""), // Hapus prefix "models/" agar bersih
        name: m.displayName || m.name.replace("models/", ""),
        description: m.description,
      }));

    return NextResponse.json({ models: availableModels });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 500 });
  }
}
