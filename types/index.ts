// ── Jenjang Types ───────────────────────────────────────────

export type Jenjang = 'SD' | 'SMP' | 'SMA'

export interface JenjangKelas {
  jenjang: Jenjang
  kelas: number
}

export const JENJANG_CONFIG: Record<Jenjang, { label: string; kelas: number[]; color: string; bgColor: string; borderColor: string }> = {
  SD:  { label: 'SD',  kelas: [4, 5, 6],       color: 'text-green-700',  bgColor: 'bg-green-50',  borderColor: 'border-green-200' },
  SMP: { label: 'SMP', kelas: [7, 8, 9],       color: 'text-blue-700',   bgColor: 'bg-blue-50',   borderColor: 'border-blue-200' },
  SMA: { label: 'SMA', kelas: [10, 11, 12],    color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
}

// ── Database Types ──────────────────────────────────────────

export interface User {
  id: string
  email: string
  nama?: string
  dibuat_pada: string
}

export interface Materi {
  id: string
  user_id: string
  judul: string
  isi: string
  file_foto?: string | null
  jenjang: Jenjang
  kelas: number
  dibuat_pada: string
  diperbarui_pada: string
}

export interface Rumus {
  id: string
  nama: string
  rumus: string
  keterangan?: string
  kategori: string
  jenjang: string // e.g. 'SD', 'SMP', 'SMA', atau 'SMP,SMA'
}

export interface Kegiatan {
  id: string
  user_id: string
  materi_id?: string | null
  nama: string
  tanggal: string
  selesai: boolean
  selesai_pada?: string | null
  jenjang: Jenjang
  kelas: number
  dibuat_pada: string
  materi?: Pick<Materi, 'id' | 'judul'> // joined dari query
}

export type StatusTugasType = 'belum' | 'dikerjakan' | 'selesai_dinilai'

export interface Tugas {
  id: string
  user_id: string
  materi_id?: string | null
  deskripsi: string
  tenggat?: string | null
  status: StatusTugasType
  jenjang: Jenjang
  kelas: number
  dibuat_pada: string
  diperbarui_pada: string
  materi?: Pick<Materi, 'id' | 'judul'> // joined dari query
}

export type JenisAktivitas =
  | 'buat_materi'
  | 'edit_materi'
  | 'hapus_materi'
  | 'buat_kegiatan'
  | 'selesai_kegiatan'
  | 'tambah_tugas'
  | 'update_status_tugas'
  | 'tanya_ai'
  | 'scan_foto'

export interface Aktivitas {
  id: string
  user_id: string
  jenis: JenisAktivitas
  deskripsi: string
  referensi_id?: string | null
  referensi_tipe?: string | null
  waktu: string
}

export type ModeAI = 'saran_materi' | 'tanya_rumus' | 'ide_latihan'

export interface LogAI {
  id: string
  user_id: string
  mode: ModeAI
  pertanyaan: string
  jawaban: string
  waktu: string
}

// ── API Response Types ──────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ── Dashboard Types ─────────────────────────────────────────

export interface RingkasanProgres {
  total_materi: number
  total_kegiatan: number
  kegiatan_selesai: number
  total_tugas: number
  tugas_selesai: number
}

export interface StatistikHarian {
  tanggal: string
  materi_dibuat: number
  kegiatan_selesai: number
}

// ── Form Types ──────────────────────────────────────────────

export interface FormMateri {
  judul: string
  isi: string
  file_foto?: string | null
  jenjang: Jenjang
  kelas: number
}

export interface FormKegiatan {
  nama: string
  tanggal: string
  materi_id?: string | null
  jenjang: Jenjang
  kelas: number
}

export interface FormTugas {
  deskripsi: string
  tenggat?: string | null
  materi_id?: string | null
  status?: StatusTugasType
  jenjang: Jenjang
  kelas: number
}
