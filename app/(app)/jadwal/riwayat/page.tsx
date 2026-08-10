import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { RiwayatKegiatanPage } from "@/components/jadwal/RiwayatKegiatanPage";

export const metadata: Metadata = { title: "Riwayat Kegiatan" };

export default async function RiwayatPage() {
  await requireAuth();
  return <RiwayatKegiatanPage />;
}
