import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";
import { randomBytes } from "crypto";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getCurrentUser();

    if (authError) console.error("Auth error:", authError.message);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jenjang = searchParams.get("jenjang");
    const kelas = searchParams.get("kelas");

    let query = supabase.database
      .from("murid")
      .select("*")
      .eq("guru_id", user.id)
      .order("dibuat_pada", { ascending: false });

    if (jenjang) query = query.eq("jenjang", jenjang);
    if (kelas) query = query.eq("kelas", kelas);

    const { data, error } = await query;

    if (error) {
      console.error("DB Query error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (err: any) {
    console.error("GET /api/murid Unhandled Error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getCurrentUser();

    if (authError) console.error("POST Auth error:", authError.message);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nama_lengkap, jenjang, kelas } = body;

    if (!nama_lengkap || !jenjang || !kelas) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Generate random 8 character PIN (e.g., A1B2-C3D4)
    const rawPin = randomBytes(4).toString("hex").toUpperCase();
    const kode_akses = `${rawPin.slice(0,4)}-${rawPin.slice(4)}`;

    const { error } = await supabase.database
      .from("murid")
      .insert([{
        guru_id: user.id,
        nama_lengkap,
        jenjang,
        kelas,
        kode_akses
      }]);

    if (error) {
      console.error("DB Insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: insertedData, error: selectError } = await supabase.database
      .from("murid")
      .select("*")
      .eq("kode_akses", kode_akses)
      .single();
      
    if (selectError) {
      console.error("DB Select error after insert:", selectError);
    }

    const responseData = insertedData || {
      id: crypto.randomUUID(),
      guru_id: user.id,
      nama_lengkap,
      jenjang,
      kelas,
      kode_akses,
      dibuat_pada: new Date().toISOString()
    };

    return NextResponse.json({ data: responseData });
  } catch (err: any) {
    console.error("POST /api/murid Unhandled Error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Server Error" }, { status: 500 });
  }
}
