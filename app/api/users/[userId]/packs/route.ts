import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the requested userId matches the authenticated user
    if (user.id !== params.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: packs, error: packsError } = await supabase
      .from("packs")
      .select("*")
      .eq("userId", params.userId);

    if (packsError) {
      return NextResponse.json(
        { error: "Failed to fetch packs" },
        { status: 500 }
      );
    }

    return NextResponse.json(packs);
  } catch (error) {
    console.error("Error in packs route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
