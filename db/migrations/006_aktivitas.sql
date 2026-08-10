-- Migrasi 006: Tabel aktivitas (riwayat aktivitas guru)
CREATE TABLE IF NOT EXISTS aktivitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  jenis VARCHAR(100) NOT NULL,  -- 'buat_materi', 'edit_materi', 'buat_kegiatan', 'selesai_kegiatan', 'tambah_tugas', 'update_status_tugas', 'tanya_ai'
  deskripsi TEXT NOT NULL,
  referensi_id UUID,            -- ID objek terkait (materi_id, kegiatan_id, dsb)
  referensi_tipe VARCHAR(50),   -- 'materi', 'kegiatan', 'tugas', 'ai'
  waktu TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aktivitas_user_waktu ON aktivitas(user_id, waktu DESC);
CREATE INDEX IF NOT EXISTS idx_aktivitas_jenis ON aktivitas(jenis);

ALTER TABLE aktivitas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guru hanya bisa akses aktivitas sendiri"
  ON aktivitas FOR ALL USING (auth.uid() = user_id);
