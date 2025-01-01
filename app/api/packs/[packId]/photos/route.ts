import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { packId: string } }
) {
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

    // First verify the pack belongs to the user
    const { data: pack, error: packError } = await supabase
      .from("packs")
      .select("userId")
      .eq("id", params.packId)
      .single();

    if (packError || !pack) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 });
    }

    if (pack.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch photos for the pack
    const { data: photos, error: photosError } = await supabase
      .from("photos")
      .select("*")
      .eq("packId", params.packId);

    if (photosError) {
      return NextResponse.json(
        { error: "Failed to fetch photos" },
        { status: 500 }
      );
    }

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error in photos route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
