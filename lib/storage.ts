import { createAdminClient } from './db.server'

/**
 * Upload file ke InsForge/Supabase Storage.
 * @param file - File Buffer atau Blob
 * @param bucket - Nama bucket (default: 'materi')
 * @param path - Path dalam bucket (misal: 'scans/userId/filename.jpg')
 */
export async function uploadFile(
  file: Buffer | Blob,
  bucket: string = 'materi',
  path: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createAdminClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file as any)

  if (error || !data) {
    return { url: null, error: error?.message || 'Upload failed' }
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path) // Use the original 'path' parameter

  return { url: publicUrlData?.publicUrl || null, error: null }
}

/**
 * Hapus file dari storage.
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  return !error
}

/**
 * Generate nama file unik berdasarkan timestamp dan user ID.
 */
export function generateFileName(userId: string, originalName: string): string {
  const ext = originalName.split('.').pop() || 'jpg'
  const timestamp = Date.now()
  return `scans/${userId}/${timestamp}.${ext}`
}
