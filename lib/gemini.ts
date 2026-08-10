const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta'

interface GeminiRequest {
  model?: string
  prompt: string
  systemInstruction?: string
}

interface GeminiResponse {
  text: string
  error?: string
}

/**
 * Wrapper utama untuk memanggil Gemini API.
 */
export async function callGemini({ model = 'models/gemini-flash-latest', prompt, systemInstruction }: GeminiRequest): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { text: '', error: 'GEMINI_API_KEY tidak dikonfigurasi' }
  }

  // Pastikan model string memiliki format yang benar (misal: "models/gemini-2.5-flash")
  const modelId = model.startsWith('models/') ? model : `models/${model}`

  try {
    const body: Record<string, unknown> = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }

    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] }
    }

    const response = await fetch(`${GEMINI_API_URL}/${modelId}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const err = await response.json()
      return { text: '', error: err?.error?.message || 'Error dari Gemini API' }
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return { text }
  } catch (error: any) {
    return { text: '', error: error.message || 'Gagal menghubungi Gemini API' }
  }
}

// ── Prompt Templates ────────────────────────────────────────

export const SYSTEM_GURU_MATEMATIKA = `Kamu adalah asisten guru matematika yang membantu guru dalam mempersiapkan bahan ajar. 
Gunakan Bahasa Indonesia yang jelas, mudah dipahami, dan sesuai untuk konteks pendidikan. 
Berikan jawaban yang praktis, terstruktur, dan langsung dapat digunakan.`

export function promptSaranMateri(namaKegiatan: string): string {
  return `Saya seorang guru matematika yang sedang mempersiapkan kegiatan mengajar: "${namaKegiatan}".
Berikan 5 topik materi matematika yang relevan dan urutan penyajiannya, beserta alasan singkat mengapa topik tersebut penting.
Format jawaban: daftar bernomor dengan judul topik dan penjelasan 1-2 kalimat.`
}

export function promptTanyaRumus(pertanyaan: string): string {
  return `Pertanyaan guru matematika: "${pertanyaan}"
Berikan penjelasan rumus yang lengkap meliputi:
1. Rumus utama (dalam format teks yang jelas)
2. Keterangan setiap variabel/simbol
3. Contoh penggunaan singkat
4. Tips mengajarkan rumus ini kepada siswa`
}

export function promptIdeLatihan(topikMateri: string): string {
  return `Saya guru matematika yang mengajarkan topik: "${topikMateri}".
Buatkan 5 soal latihan dengan tingkat kesulitan bertahap (mudah, sedang, sulit) beserta kunci jawaban singkat.
Format: nomor soal, tingkat kesulitan, pertanyaan, kunci jawaban.`
}
