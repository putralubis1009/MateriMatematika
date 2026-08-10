-- Migrasi 007: Tabel log_ai (riwayat interaksi AI)
CREATE TABLE IF NOT EXISTS log_ai (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode VARCHAR(50) NOT NULL CHECK (mode IN ('saran_materi', 'tanya_rumus', 'ide_latihan')),
  pertanyaan TEXT NOT NULL,
  jawaban TEXT NOT NULL,
  waktu TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_log_ai_user_mode ON log_ai(user_id, mode);
CREATE INDEX IF NOT EXISTS idx_log_ai_waktu ON log_ai(waktu DESC);

ALTER TABLE log_ai ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guru hanya bisa akses log AI sendiri"
  ON log_ai FOR ALL USING (auth.uid() = user_id);
