import type { Metadata } from "next";
import { TugasPage } from "@/components/tugas/TugasPage";

export const metadata: Metadata = { title: "Daftar Tugas" };

export default function TugasRoutePage() {
  return <TugasPage />;
}
