-- Migrasi 009: Sistem Murid (akses read-only ke materi & soal)
-- Jalankan file ini di SQL Editor InsForge Dashboard

-- ── Tabel Murid ─────────────────────────────────────────────
-- Murid dibuat oleh guru, tidak butuh akun InsForge Auth
CREATE TABLE IF NOT EXISTS murid (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_lengkap VARCHAR(255) NOT NULL,
  kode_akses VARCHAR(20) NOT NULL UNIQUE,  -- PIN/kode unik yang guru berikan ke murid
  jenjang VARCHAR(10) NOT NULL DEFAULT 'SMP',
  kelas INT NOT NULL DEFAULT 7,
  dibuat_pada TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_murid_guru_id ON murid(guru_id);
CREATE INDEX IF NOT EXISTS idx_murid_kode_akses ON murid(kode_akses);

ALTER TABLE murid ENABLE ROW LEVEL SECURITY;

-- Guru hanya bisa kelola murid miliknya sendiri
CREATE POLICY "Guru kelola murid sendiri"
  ON murid FOR ALL USING (auth.uid() = guru_id);

-- ── Tabel Sesi Murid ─────────────────────────────────────────
-- Token session sederhana yang dibuat saat murid login
CREATE TABLE IF NOT EXISTS murid_sesi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  murid_id UUID NOT NULL REFERENCES murid(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL UNIQUE,
  dibuat_pada TIMESTAMPTZ DEFAULT NOW(),
  kadaluarsa TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '12 hours')
);

CREATE INDEX IF NOT EXISTS idx_murid_sesi_token ON murid_sesi(token);
CREATE INDEX IF NOT EXISTS idx_murid_sesi_murid_id ON murid_sesi(murid_id);

ALTER TABLE murid_sesi ENABLE ROW LEVEL SECURITY;

-- Service role saja yang bisa operasi tabel sesi
CREATE POLICY "Service role sesi"
  ON murid_sesi FOR ALL USING (true);
