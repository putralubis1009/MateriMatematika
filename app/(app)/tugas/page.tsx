import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { TugasPage } from "@/components/tugas/TugasPage";

export const metadata: Metadata = { title: "Daftar Tugas" };

export default async function TugasRoutePage() {
  await requireAuth();
  return <TugasPage />;
}
