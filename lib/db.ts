
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

import { createBrowserClient as createClientSsr } from '@insforge/sdk/ssr'

/**
 * Client Supabase untuk browser (komponen client-side "use client").
 * Menggunakan cookie session secara otomatis.
 */
export function createBrowserClient() {
  return createClientSsr({
    baseUrl: supabaseUrl,
    anonKey: supabaseAnonKey,
  })
}

