import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// GET /api/ai/riwayat?mode=tanya_rumus — Riwayat log AI per mode
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mode = request.nextUrl.searchParams.get("mode");

  let query = supabase.database.from("log_ai")
    .select("*")
    .eq("user_id", session.user.id)
    .order("waktu", { ascending: false })
    .limit(20);

  if (mode) query = query.eq("mode", mode);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
