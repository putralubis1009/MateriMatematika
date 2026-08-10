import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/db.server";
import { MateriList } from "@/components/materi/MateriList";
import type { Materi } from "@/types";

export const metadata: Metadata = { title: "Daftar Materi" };

export default async function MateriPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAuth();
  const supabase = await createSupabaseServerClient();
  const session = await requireAuth();
  const { q } = await searchParams;

  let query = supabase.database.from("materi")
    .select("*")
    .eq("user_id", session.user.id)
    .order("diperbarui_pada", { ascending: false });

  if (q) {
    query = query.ilike("judul", `%${q}%`);
  }

  const { data: materi } = await query;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Materi</h1>
          <p className="text-sm text-gray-500 mt-1">Semua catatan materi ajar Anda</p>
        </div>
        <Link
          href="/materi/baru"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Catatan Baru
        </Link>
      </div>

      <MateriList materi={(materi as Materi[]) ?? []} searchQuery={q} />
    </div>
  );
}
