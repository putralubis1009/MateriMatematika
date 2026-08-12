import type { Metadata } from "next";
import { JadwalPage } from "@/components/jadwal/JadwalPage";

export const metadata: Metadata = { title: "Jadwal & Checklist" };

export default function JadwalRoutePage() {
  return <JadwalPage />;
}
