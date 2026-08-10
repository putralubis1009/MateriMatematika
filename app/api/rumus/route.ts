import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/rumus — Daftar semua rumus (bisa difilter per kategori)
export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.database.from("rumus")
    .select("*")
    .order("kategori", { ascending: true })
    .order("nama", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
