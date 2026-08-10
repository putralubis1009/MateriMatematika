import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";
import { generateMateriPDF } from "@/lib/pdf";
import type { Materi } from "@/types";

// GET /api/materi/[id]/pdf — Generate dan download PDF materi
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: materi, error } = await supabase.database.from("materi")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error || !materi) {
    return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
  }

  const m = materi as Materi;
  const pdfResult = generateMateriPDF({
    judul: m.judul,
    isi: m.isi,
    diperbarui_pada: m.diperbarui_pada,
  });

  // jsPDF mengembalikan ArrayBuffer, convert ke Buffer agar kompatibel dengan NextResponse
  const buffer = Buffer.from(pdfResult as unknown as ArrayBuffer);
  const safeTitle = m.judul.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeTitle}.pdf"`,
    },
  });
}
