import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { AIPage } from "@/components/ai/AIPage";

export const metadata: Metadata = { title: "Rekomendasi AI" };

export default async function AIRoutePage() {
  await requireAuth();
  return <AIPage />;
}
