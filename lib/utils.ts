import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'

// ── Tailwind ────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Format Tanggal ──────────────────────────────────────────

export function formatTanggal(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd MMMM yyyy', { locale: id })
}

export function formatTanggalPendek(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd MMM yyyy', { locale: id })
}

export function formatWaktuRelatif(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: id })
}

export function formatWaktu(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'HH:mm', { locale: id })
}

// ── Status Tenggat ──────────────────────────────────────────

export type StatusTenggat = 'aman' | 'dekat' | 'terlewat'

export function getStatusTenggat(tenggat: string | Date | null | undefined): StatusTenggat {
  if (!tenggat) return 'aman'
  const d = typeof tenggat === 'string' ? new Date(tenggat) : tenggat
  if (isPast(d) && !isToday(d)) return 'terlewat'
  const sisaHari = differenceInDays(d, new Date())
  if (sisaHari <= 3) return 'dekat'
  return 'aman'
}

export function getLabelTenggat(tenggat: string | Date | null | undefined): string {
  if (!tenggat) return 'Tidak ada tenggat'
  const d = typeof tenggat === 'string' ? new Date(tenggat) : tenggat
  if (isPast(d) && !isToday(d)) return `Terlewat ${formatDistanceToNow(d, { locale: id })} lalu`
  if (isToday(d)) return 'Hari ini!'
  if (isTomorrow(d)) return 'Besok'
  const sisaHari = differenceInDays(d, new Date())
  if (sisaHari <= 3) return `${sisaHari} hari lagi`
  return formatTanggalPendek(d)
}

// ── Label Status Tugas ──────────────────────────────────────

export type StatusTugas = 'belum' | 'dikerjakan' | 'selesai_dinilai'

export const LABEL_STATUS_TUGAS: Record<StatusTugas, string> = {
  belum: 'Belum Dikerjakan',
  dikerjakan: 'Sedang Dikerjakan',
  selesai_dinilai: 'Selesai Dinilai',
}

export const WARNA_STATUS_TUGAS: Record<StatusTugas, string> = {
  belum: 'bg-gray-100 text-gray-600',
  dikerjakan: 'bg-yellow-100 text-yellow-700',
  selesai_dinilai: 'bg-green-100 text-green-700',
}

// ── Truncate Teks ───────────────────────────────────────────

export function truncate(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// ── Salin ke Clipboard ──────────────────────────────────────

export async function salinKeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// ── Label Jenis Aktivitas ───────────────────────────────────

export const LABEL_AKTIVITAS: Record<string, string> = {
  buat_materi: '📝 Membuat catatan materi',
  edit_materi: '✏️ Mengedit catatan materi',
  hapus_materi: '🗑️ Menghapus catatan materi',
  buat_kegiatan: '📅 Membuat kegiatan',
  selesai_kegiatan: '✅ Menyelesaikan kegiatan',
  tambah_tugas: '📋 Menambahkan tugas',
  update_status_tugas: '🔄 Memperbarui status tugas',
  tanya_ai: '🤖 Menggunakan fitur AI',
  scan_foto: '📷 Memindai foto materi',
}
