-- Migrasi 004: Tabel kegiatan (jadwal & checklist mengajar)
CREATE TABLE IF NOT EXISTS kegiatan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materi_id UUID REFERENCES materi(id) ON DELETE SET NULL,
  nama VARCHAR(500) NOT NULL,
  tanggal DATE NOT NULL,
  selesai BOOLEAN DEFAULT FALSE,
  selesai_pada TIMESTAMPTZ,
  dibuat_pada TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kegiatan_user_tanggal ON kegiatan(user_id, tanggal);
CREATE INDEX IF NOT EXISTS idx_kegiatan_selesai ON kegiatan(selesai);

ALTER TABLE kegiatan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guru hanya bisa akses kegiatan sendiri"
  ON kegiatan FOR ALL USING (auth.uid() = user_id);
