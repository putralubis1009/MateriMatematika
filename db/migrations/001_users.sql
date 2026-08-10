-- Migrasi 001: Tabel users (data guru)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  dibuat_pada TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Guru hanya bisa lihat/ubah data dirinya sendiri
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);
