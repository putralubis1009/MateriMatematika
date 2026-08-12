import { Metadata } from "next";
import { MuridList } from "@/components/murid/MuridList";

export const metadata: Metadata = {
  title: "Kelola Murid - Kelas MTK Dewi",
  description: "Manajemen data murid dan kode akses",
};

export default function MuridPage() {
  return <MuridList />;
}
