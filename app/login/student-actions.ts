"use server";

import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/db.server";
import { randomBytes } from "crypto";

export async function studentLoginAction(formData: FormData) {
  try {
    const nama_lengkap = (formData.get("nama_lengkap") as string)?.trim();
    const kode_akses = (formData.get("kode_akses") as string)
      ?.trim()
      .toUpperCase();

    if (!nama_lengkap || !kode_akses) {
      return { error: "Nama lengkap dan kode akses wajib diisi." };
    }

    // Gunakan admin client (bypass RLS) untuk validasi kode akses
    const admin = createAdminClient();

    // Cari murid berdasarkan kode akses
    const { data: murid, error: muridError } = await admin.database
      .from("murid")
      .select("*")
      .eq("kode_akses", kode_akses)
      .single();

    if (muridError || !murid) {
      console.error("DEBUG studentLoginAction error:", muridError);
      return { error: `[DEBUG] DB Error: ${muridError?.message || "Row not found"}` };
    }

    // Validasi nama (case-insensitive, tolerant whitespace)
    const namaDB = murid.nama_lengkap?.toLowerCase().replace(/\s+/g, " ").trim();
    const namaInput = nama_lengkap.toLowerCase().replace(/\s+/g, " ").trim();

    if (namaDB !== namaInput) {
      return { error: "Nama tidak sesuai dengan kode akses ini." };
    }

    // Buat token sesi
    const token = randomBytes(32).toString("hex");

    const { error: sesiError } = await admin.database
      .from("murid_sesi")
      .insert([{
        murid_id: murid.id,
        token,
        kadaluarsa: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      }]);

    if (sesiError) {
      console.error("Gagal membuat sesi murid:", sesiError);
      return { error: "Gagal membuat sesi. Coba lagi." };
    }

    // Set cookie sesi murid (HttpOnly)
    const cookieStore = await cookies();
    cookieStore.set("murid_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 12 * 60 * 60, // 12 jam dalam detik
    });

    return { success: true };
  } catch (err: any) {
    console.error("studentLoginAction error:", err);
    return { error: err?.message || "Terjadi kesalahan server." };
  }
}

export async function studentLogoutAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("murid_session")?.value;

    if (token) {
      const admin = createAdminClient();
      await admin.database.from("murid_sesi").delete().eq("token", token);
      cookieStore.delete("murid_session");
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.message };
  }
}
