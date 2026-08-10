-- Migrasi 008: Tambah kolom jenjang & kelas ke tabel utama
-- Jenjang: 'SD' (Kls 4-6), 'SMP' (Kls 7-9), 'SMA' (Kls 10-12)

-- ── Materi ─────────────────────────────────────────────────
ALTER TABLE materi
  ADD COLUMN IF NOT EXISTS jenjang VARCHAR(10) NOT NULL DEFAULT 'SMP',
  ADD COLUMN IF NOT EXISTS kelas   INT         NOT NULL DEFAULT 7;

CREATE INDEX IF NOT EXISTS idx_materi_jenjang_kelas ON materi(user_id, jenjang, kelas);

-- ── Kegiatan (Jadwal) ───────────────────────────────────────
ALTER TABLE kegiatan
  ADD COLUMN IF NOT EXISTS jenjang VARCHAR(10) NOT NULL DEFAULT 'SMP',
  ADD COLUMN IF NOT EXISTS kelas   INT         NOT NULL DEFAULT 7;

CREATE INDEX IF NOT EXISTS idx_kegiatan_jenjang_kelas ON kegiatan(user_id, jenjang, kelas);

-- ── Tugas ───────────────────────────────────────────────────
ALTER TABLE tugas
  ADD COLUMN IF NOT EXISTS jenjang VARCHAR(10) NOT NULL DEFAULT 'SMP',
  ADD COLUMN IF NOT EXISTS kelas   INT         NOT NULL DEFAULT 7;

CREATE INDEX IF NOT EXISTS idx_tugas_jenjang_kelas ON tugas(user_id, jenjang, kelas);

-- ── Rumus: tambah kolom jenjang untuk filter pustaka ────────
ALTER TABLE rumus
  ADD COLUMN IF NOT EXISTS jenjang VARCHAR(20) NOT NULL DEFAULT 'SMP,SMA';

CREATE INDEX IF NOT EXISTS idx_rumus_jenjang ON rumus(jenjang);

-- Update seed rumus dengan jenjang yang sesuai
UPDATE rumus SET jenjang = 'SD' WHERE nama IN (
  'Luas Persegi', 'Luas Persegi Panjang', 'Luas Segitiga',
  'Luas Lingkaran', 'Keliling Lingkaran', 'Luas Trapesium',
  'Luas Jajargenjang', 'Volume Kubus', 'Volume Balok',
  'Teorema Pythagoras', 'Rata-rata', 'Peluang'
);

UPDATE rumus SET jenjang = 'SMP' WHERE nama IN (
  'Teorema Pythagoras', 'Barisan Aritmatika', 'Deret Aritmatika',
  'Barisan Geometri', 'Volume Bola', 'Volume Kerucut', 'Volume Silinder',
  'Selisih Kuadrat', 'Kuadrat Sempurna', 'Rata-rata', 'Varians',
  'Standar Deviasi', 'Peluang', 'Rumus Kuadrat'
);

UPDATE rumus SET jenjang = 'SMA' WHERE nama IN (
  'Rumus Kuadrat', 'Pangkat Negatif', 'Logaritma Dasar',
  'Definisi Sin', 'Definisi Cos', 'Definisi Tan',
  'Identitas Pythagoras', 'Aturan Sinus', 'Aturan Cosinus',
  'Varians', 'Standar Deviasi', 'Barisan Geometri'
);
