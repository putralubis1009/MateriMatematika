import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db.server";

// POST /api/student/logout — Hapus sesi murid
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("murid_session")?.value;

    if (token) {
      const admin = createAdminClient();
      await admin.database.from("murid_sesi").delete().eq("token", token);
    }
  } catch (err) {
    console.error("Gagal menghapus sesi di DB:", err);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("murid_session");
  return response;
}
