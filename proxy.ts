import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@insforge/sdk/ssr/middleware'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Cek Sesi Murid ──────────────────────────────────────
  const muridToken = request.cookies.get('murid_session')?.value

  // Rute khusus murid (termasuk API untuk murid)
  const isStudentRoute = pathname.startsWith('/student-dashboard') || pathname.startsWith('/api/student')

  // Rute publik (tidak butuh auth apapun)
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.some(r => pathname === r || pathname.startsWith(r + '/'))

  // Rute guru (management)
  const guruOnlyRoutes = ['/dashboard', '/materi', '/tugas', '/jadwal', '/ai', '/rumus']
  const isGuruOnlyRoute = guruOnlyRoutes.some(r => pathname === r || pathname.startsWith(r + '/'))

  // ── Jika sesi murid ada dan mencoba akses rute guru → tolak ──
  if (muridToken && isGuruOnlyRoute) {
    return NextResponse.redirect(new URL('/student-dashboard', request.url))
  }

  // ── Jika murid mencoba akses rute publik (login) → arahkan ke student-dashboard ──
  if (muridToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/student-dashboard', request.url))
  }

  // ── Jika akses student-dashboard tanpa sesi murid ──
  if (isStudentRoute && !muridToken) {
    // Cek dulu: mungkin ini sesi guru yang salah masuk → redirect ke /dashboard
    // Akan dihandle oleh cek guru di bawah
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ── Jika akses rute murid dengan sesi murid valid → lanjutkan ──
  if (isStudentRoute && muridToken) {
    return NextResponse.next()
  }

  // ── Untuk semua rute lain: cek sesi guru via InsForge ──
  let response = NextResponse.next({ request: { headers: request.headers } })

  const { accessToken } = await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
    baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })

  const isGuruLoggedIn = !!accessToken

  // Rute publik → lewatkan saja
  if (isPublicRoute) {
    // Jika sudah login sebagai guru → redirect ke dashboard
    if (isGuruLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // Rute yang butuh login guru
  if (!isGuruLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
