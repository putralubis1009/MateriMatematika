/**
 * db.server.ts — Hanya digunakan di Server Components & API Routes
 * File ini mengimport next/headers sehingga TIDAK boleh diimport dari client components.
 */
import { createClient } from '@insforge/sdk'
import { createServerClient, type CookieOptions } from '@insforge/sdk/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Client Supabase dengan cookie session — untuk Server Components & API Routes.
 * Secara otomatis membaca sesi dari cookie request.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient({
    baseUrl: supabaseUrl,
    anonKey: supabaseAnonKey,
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

/**
 * Admin client untuk operasi server-side yang butuh bypass RLS.
 * Gunakan hanya di API Routes / Server Actions.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient({
    baseUrl: supabaseUrl,
    anonKey: serviceRoleKey,
  })
}
