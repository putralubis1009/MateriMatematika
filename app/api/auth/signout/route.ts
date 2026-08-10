import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";
import { cookies } from "next/headers";

// POST /api/auth/signout
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.error(e);
  }

  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith("sb-") || cookie.name.includes("-auth-token")) {
      cookieStore.delete(cookie.name);
    }
  }

  return NextResponse.redirect(new URL("/login", request.url), 303);
}

// GET /api/auth/signout
export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.error(e);
  }

  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith("sb-") || cookie.name.includes("-auth-token")) {
      cookieStore.delete(cookie.name);
    }
  }

  return NextResponse.redirect(new URL("/login", request.url), 303);
}
