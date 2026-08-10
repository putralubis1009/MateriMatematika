-- Migrasi 002: Tabel materi (catatan materi ajar)
CREATE TABLE IF NOT EXISTS materi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  judul VARCHAR(500) NOT NULL,
  isi TEXT DEFAULT '',
  file_foto TEXT,          -- URL foto scan (InsForge Storage)
  dibuat_pada TIMESTAMPTZ DEFAULT NOW(),
  diperbarui_pada TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian dan filter per user
CREATE INDEX IF NOT EXISTS idx_materi_user_id ON materi(user_id);
CREATE INDEX IF NOT EXISTS idx_materi_judul ON materi USING gin(to_tsvector('indonesian', judul));

-- Trigger: perbarui kolom diperbarui_pada otomatis
CREATE OR REPLACE FUNCTION update_diperbarui_pada()
RETURNS TRIGGER AS $$
BEGIN
  NEW.diperbarui_pada = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_materi_diperbarui
  BEFORE UPDATE ON materi
  FOR EACH ROW EXECUTE FUNCTION update_diperbarui_pada();

-- Row Level Security
ALTER TABLE materi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guru hanya bisa akses materi sendiri"
  ON materi FOR ALL USING (auth.uid() = user_id);
