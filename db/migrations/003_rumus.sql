-- Migrasi 003: Tabel rumus (pustaka rumus matematika)
CREATE TABLE IF NOT EXISTS rumus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  rumus TEXT NOT NULL,
  keterangan TEXT,
  kategori VARCHAR(100) NOT NULL DEFAULT 'Umum'
);

-- Index untuk filter per kategori
CREATE INDEX IF NOT EXISTS idx_rumus_kategori ON rumus(kategori);

-- Tabel ini bisa dibaca semua user (public read)
ALTER TABLE rumus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Semua user bisa baca rumus" ON rumus FOR SELECT USING (true);

-- ============================================================
-- SEED DATA: Rumus Matematika Umum
-- ============================================================

INSERT INTO rumus (nama, rumus, keterangan, kategori) VALUES
-- ALJABAR
('Rumus Kuadrat', 'x = (-b ± √(b²-4ac)) / 2a', 'Solusi persamaan ax² + bx + c = 0', 'Aljabar'),
('Selisih Kuadrat', 'a² - b² = (a+b)(a-b)', 'Faktorisasi selisih dua kuadrat', 'Aljabar'),
('Kuadrat Sempurna', '(a+b)² = a² + 2ab + b²', 'Ekspansi kuadrat sempurna', 'Aljabar'),
('Pangkat Negatif', 'a⁻ⁿ = 1/aⁿ', 'Definisi pangkat negatif', 'Aljabar'),
('Logaritma Dasar', 'logₐ(mn) = logₐm + logₐn', 'Sifat logaritma perkalian', 'Aljabar'),
('Barisan Aritmatika', 'aₙ = a₁ + (n-1)d', 'Suku ke-n barisan aritmatika', 'Aljabar'),
('Deret Aritmatika', 'Sₙ = n/2(a₁ + aₙ)', 'Jumlah n suku pertama deret aritmatika', 'Aljabar'),
('Barisan Geometri', 'aₙ = a₁ · rⁿ⁻¹', 'Suku ke-n barisan geometri', 'Aljabar'),

-- GEOMETRI
('Luas Persegi', 'L = s²', 'Luas persegi dengan sisi s', 'Geometri'),
('Luas Persegi Panjang', 'L = p × l', 'Luas persegi panjang', 'Geometri'),
('Luas Segitiga', 'L = ½ × a × t', 'Luas segitiga dengan alas a dan tinggi t', 'Geometri'),
('Luas Lingkaran', 'L = πr²', 'Luas lingkaran dengan jari-jari r', 'Geometri'),
('Keliling Lingkaran', 'K = 2πr', 'Keliling (circumference) lingkaran', 'Geometri'),
('Luas Trapesium', 'L = ½(a+b) × t', 'Luas trapesium dengan dua sisi sejajar a,b dan tinggi t', 'Geometri'),
('Luas Jajargenjang', 'L = a × t', 'Luas jajargenjang', 'Geometri'),
('Volume Kubus', 'V = s³', 'Volume kubus dengan sisi s', 'Geometri'),
('Volume Balok', 'V = p × l × t', 'Volume balok', 'Geometri'),
('Volume Bola', 'V = (4/3)πr³', 'Volume bola dengan jari-jari r', 'Geometri'),
('Volume Kerucut', 'V = (1/3)πr²t', 'Volume kerucut', 'Geometri'),
('Volume Silinder', 'V = πr²t', 'Volume silinder', 'Geometri'),
('Teorema Pythagoras', 'c² = a² + b²', 'Hubungan sisi segitiga siku-siku', 'Geometri'),

-- TRIGONOMETRI
('Definisi Sin', 'sin θ = sisi depan / hipotenusa', 'Rasio sinus dalam segitiga siku-siku', 'Trigonometri'),
('Definisi Cos', 'cos θ = sisi samping / hipotenusa', 'Rasio kosinus dalam segitiga siku-siku', 'Trigonometri'),
('Definisi Tan', 'tan θ = sin θ / cos θ', 'Rasio tangen', 'Trigonometri'),
('Identitas Pythagoras', 'sin²θ + cos²θ = 1', 'Identitas trigonometri dasar', 'Trigonometri'),
('Aturan Sinus', 'a/sin A = b/sin B = c/sin C', 'Aturan sinus untuk segitiga sembarang', 'Trigonometri'),
('Aturan Cosinus', 'c² = a² + b² - 2ab·cos C', 'Aturan cosinus untuk segitiga sembarang', 'Trigonometri'),

-- STATISTIKA
('Rata-rata', 'x̄ = Σxᵢ / n', 'Mean atau nilai rata-rata', 'Statistika'),
('Varians', 'σ² = Σ(xᵢ - x̄)² / n', 'Ukuran sebaran data', 'Statistika'),
('Standar Deviasi', 'σ = √(Σ(xᵢ - x̄)² / n)', 'Akar kuadrat varians', 'Statistika'),
('Peluang', 'P(A) = n(A) / n(S)', 'Probabilitas kejadian A', 'Statistika');
