import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

// POST /api/auth/signout
export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
