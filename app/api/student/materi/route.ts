import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db.server";

// GET /api/student/materi — Ambil daftar materi guru untuk murid (read-only)
export async function GET(request: NextRequest) {
  const token = request.cookies.get("murid_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Validasi sesi
  const { data: sesi } = await admin.database
    .from("murid_sesi")
    .select("*, murid(*)")
    .eq("token", token)
    .gt("kadaluarsa", new Date().toISOString())
    .single();

  if (!sesi?.murid) {
    return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
  }

  const murid = sesi.murid as any;

  // Ambil materi dari guru yang memiliki murid ini, berdasarkan jenjang & kelas
  const { data: materi, error } = await admin.database
    .from("materi")
    .select("*")
    .eq("user_id", murid.guru_id)
    .eq("jenjang", murid.jenjang)
    .eq("kelas", murid.kelas)
    .order("diperbarui_pada", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: materi ?? [] });
}
