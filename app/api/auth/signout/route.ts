import { NextResponse } from "next/server";
import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";

// POST /api/auth/signout
export async function POST(request: Request) {
  try {
    const auth = createAuthActions({
      cookies: await cookies(),
      baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });
    await auth.signOut();
  } catch (e) {
    console.error(e);
  }

  return NextResponse.redirect(new URL("/login", request.url), 303);
}

// GET /api/auth/signout
export async function GET(request: Request) {
  try {
    const auth = createAuthActions({
      cookies: await cookies(),
      baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });
    await auth.signOut();
  } catch (e) {
    console.error(e);
  }

  return NextResponse.redirect(new URL("/login", request.url), 303);
}
