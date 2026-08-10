import { createSupabaseServerClient } from './db.server'
import { redirect } from 'next/navigation'

/**
 * Mendapatkan sesi user yang sedang login dari server.
 * Jika tidak ada sesi, redirect ke halaman login.
 */
export async function requireAuth() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getCurrentUser()

  if (error || !user) {
    redirect('/login')
  }

  // Mengembalikan mock session object agar kompatibel dengan kode yang ada
  return { user }
}

/**
 * Mendapatkan sesi user tanpa redirect (untuk layout/middleware).
 */
export async function getSession() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getCurrentUser()
  return user ? { user } : null
}

/**
 * Sign out user dan redirect ke halaman login.
 */
export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
