import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db.server";

// GET /api/student/me — Ambil data murid dari token sesi
export async function GET(request: NextRequest) {
  const token = request.cookies.get("murid_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Cari sesi berdasarkan token
  const { data: sesi, error: sesiError } = await admin.database
    .from("murid_sesi")
    .select("*, murid(*)")
    .eq("token", token)
    .gt("kadaluarsa", new Date().toISOString())
    .single();

  if (sesiError || !sesi) {
    return NextResponse.json({ error: "Sesi tidak valid atau sudah kadaluarsa" }, { status: 401 });
  }

  return NextResponse.json({ data: sesi.murid });
}
