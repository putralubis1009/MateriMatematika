import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/db.server";
import { StudentLayoutClient } from "@/components/student/StudentLayoutClient";

export default async function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("murid_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const admin = createAdminClient();

  const { data: sesi } = await admin.database
    .from("murid_sesi")
    .select("*, murid(*)")
    .eq("token", token)
    .gt("kadaluarsa", new Date().toISOString())
    .single();

  if (!sesi?.murid) {
    redirect("/login");
  }

  const murid = sesi.murid as any;

  return (
    <StudentLayoutClient
      muridNama={murid.nama_lengkap}
      muridJenjang={murid.jenjang}
      muridKelas={murid.kelas}
    >
      {children}
    </StudentLayoutClient>
  );
}
