import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    const supabase = await createClient();
    const { rating } = await request.json();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the photo rating
    const { data, error } = await supabase
      .from("photos")
      .update({ rating })
      .eq("id", params.photoId)
      .eq("userId", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating photo rating:", error);
      return NextResponse.json(
        { error: "Failed to update rating" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in rate route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
