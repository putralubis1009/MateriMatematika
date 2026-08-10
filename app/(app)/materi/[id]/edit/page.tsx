import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/db.server";
import { MateriFormPage } from "@/components/materi/MateriFormPage";
import type { Materi } from "@/types";

export const metadata: Metadata = { title: "Edit Catatan" };

export default async function EditMateriPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const { data: materi } = await supabase.database.from("materi")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (!materi) notFound();

  return <MateriFormPage mode="edit" materi={materi as Materi} />;
}
