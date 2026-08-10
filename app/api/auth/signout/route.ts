import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// POST /api/auth/signout
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url), 303);
}
