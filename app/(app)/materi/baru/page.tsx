import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { MateriFormPage } from "@/components/materi/MateriFormPage";

export const metadata: Metadata = { title: "Catatan Baru" };

export default async function MateriBaruPage() {
  await requireAuth();
  return <MateriFormPage mode="create" />;
}
