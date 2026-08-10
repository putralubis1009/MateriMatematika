import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/db.server";
import { requireAuth } from "@/lib/auth";
import { PustakaRumusPage } from "@/components/rumus/PustakaRumusPage";
import type { Rumus } from "@/types";

export const metadata: Metadata = { title: "Pustaka Rumus" };

export default async function RumusRoutePage() {
  await requireAuth();
  const supabase = await createSupabaseServerClient();

  const { data: rumus } = await supabase.database.from("rumus")
    .select("*")
    .order("kategori", { ascending: true });

  return <PustakaRumusPage rumus={(rumus as Rumus[]) ?? []} />;
}
