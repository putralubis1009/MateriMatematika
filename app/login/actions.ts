"use server";

import { cookies } from "next/headers";
import { createAuthActions } from "@insforge/sdk/ssr";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const auth = createAuthActions({ 
      cookies: await cookies(),
      baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });

    console.log("loginAction called with email", email);

    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("loginAction auth error", error.message);
      return { error: error.message };
    }

    console.log("loginAction success");
    return { success: true };
  } catch (err: any) {
    console.error("loginAction caught exception", err);
    return { error: err?.message || "Internal server error" };
  }
}
