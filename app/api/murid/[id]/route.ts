import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/db.server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getCurrentUser();

    if (authError) console.error("DELETE Auth error:", authError.message);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    const { error } = await supabase.database
      .from("murid")
      .delete()
      .eq("id", id)
      .eq("guru_id", user.id);

    if (error) {
      console.error("DB Delete error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/murid Unhandled Error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Server Error" }, { status: 500 });
  }
}
