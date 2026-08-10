import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { JadwalPage } from "@/components/jadwal/JadwalPage";

export const metadata: Metadata = { title: "Jadwal & Checklist" };

export default async function JadwalRoutePage() {
  await requireAuth();
  return <JadwalPage />;
}
