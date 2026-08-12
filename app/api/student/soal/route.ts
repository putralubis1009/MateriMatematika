import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db.server";

// GET /api/student/soal — Ambil daftar soal/tugas untuk murid (read-only)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("murid_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Validasi sesi
    const { data: sesi, error: sesiError } = await admin.database
      .from("murid_sesi")
      .select("*, murid(*)")
      .eq("token", token)
      .gt("kadaluarsa", new Date().toISOString())
      .single();

    if (sesiError) {
      console.error("DB Sesi Error:", sesiError);
      return NextResponse.json({ error: "Database error saat memvalidasi sesi" }, { status: 500 });
    }

    if (!sesi || !sesi.murid) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    // if murid is somehow returned as an array, take the first element
    const murid = Array.isArray(sesi.murid) ? sesi.murid[0] : sesi.murid;

    if (!murid || !murid.guru_id) {
      return NextResponse.json({ error: "Data murid tidak lengkap" }, { status: 500 });
    }

    // Ambil tugas/soal dari guru yang memiliki murid ini, berdasarkan jenjang & kelas
    // Cast kelas to integer to ensure type match with INT column
    const kelasInt = parseInt(String(murid.kelas), 10);
    console.log(`[soal] Querying: guru_id=${murid.guru_id}, jenjang=${murid.jenjang}, kelas=${kelasInt}`);
    
    const { data: soal, error } = await admin.database
      .from("tugas")
      .select("*, materi(id, judul)")
      .eq("user_id", murid.guru_id)
      .eq("jenjang", murid.jenjang)
      .eq("kelas", kelasInt)
      .order("dibuat_pada", { ascending: false });

    if (error) {
      console.error("DB Soal Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: soal ?? [] });
  } catch (err: any) {
    console.error("GET /api/student/soal Unhandled Error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Server Error" }, { status: 500 });
  }
}
