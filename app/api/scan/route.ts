import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";
import { uploadFile, generateFileName } from "@/lib/storage";

// POST /api/scan — Upload foto scan materi
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getCurrentUser();
  const session = user ? { user } : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("foto") as File | null;

  if (!file) {
    return NextResponse.json({ error: "File foto tidak ditemukan" }, { status: 400 });
  }

  // Validasi tipe file
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Format file tidak didukung. Gunakan JPEG, PNG, atau WebP." }, { status: 400 });
  }

  // Validasi ukuran (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Ukuran file terlalu besar. Maksimal 10MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = generateFileName(session.user.id, file.name);
  const { url, error } = await uploadFile(buffer, "materi", filePath);

  if (error || !url) {
    return NextResponse.json({ error: "Gagal mengupload foto" }, { status: 500 });
  }

  // Catat aktivitas scan
  await supabase.database.from("aktivitas").insert({
    user_id: session.user.id,
    jenis: "scan_foto",
    deskripsi: "Memindai foto materi",
  });

  return NextResponse.json({ url }, { status: 201 });
}
