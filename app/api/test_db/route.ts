import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db.server";

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin.database
    .from("murid")
    .select("*")
    .eq("kode_akses", "8E88-596F")
    .single();

  return NextResponse.json({
    data,
    error,
    env_vars: {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  });
}
