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

  // Manually delete session cookies since createSupabaseServerClient is read-only
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith("sb-") || cookie.name.includes("-auth-token")) {
      cookieStore.delete(cookie.name);
    }
  }

  return NextResponse.redirect(new URL("/login", request.url), 303);
}
