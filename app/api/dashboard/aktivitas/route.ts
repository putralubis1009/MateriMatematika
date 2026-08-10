import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/dashboard/aktivitas?q=keyword — Riwayat aktivitas + pencarian
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q");

  let query = supabase.database.from("aktivitas")
    .select("*")
    .eq("user_id", session.user.id)
    .order("waktu", { ascending: false })
    .limit(50);

  if (q) query = query.ilike("deskripsi", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
