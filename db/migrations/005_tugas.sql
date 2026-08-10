-- Migrasi 005: Tabel tugas (daftar tugas siswa)
CREATE TABLE IF NOT EXISTS tugas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materi_id UUID REFERENCES materi(id) ON DELETE SET NULL,
  deskripsi TEXT NOT NULL,
  tenggat DATE,
  status VARCHAR(50) DEFAULT 'belum' CHECK (status IN ('belum', 'dikerjakan', 'selesai_dinilai')),
  dibuat_pada TIMESTAMPTZ DEFAULT NOW(),
  diperbarui_pada TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tugas_user_id ON tugas(user_id);
CREATE INDEX IF NOT EXISTS idx_tugas_status ON tugas(status);
CREATE INDEX IF NOT EXISTS idx_tugas_tenggat ON tugas(tenggat);

CREATE TRIGGER trigger_tugas_diperbarui
  BEFORE UPDATE ON tugas
  FOR EACH ROW EXECUTE FUNCTION update_diperbarui_pada();

ALTER TABLE tugas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guru hanya bisa akses tugas sendiri"
  ON tugas FOR ALL USING (auth.uid() = user_id);
