import { updateCredits } from "@/lib/credits";
import { createClient } from "@/lib/supabase/server";
import { serviceRole } from "@/lib/supabase/service-role";

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ photoId: string }> }
) {
  const params = await props.params;
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
    const { data, error } = await serviceRole
      .from("faceless_photos")
      .update({ rating: rating })
      .eq("id", parseInt(params.photoId))
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

    // 10% chance to give 3 free credits
    const shouldGiveCredits = Math.random() < 0.1;

    if (shouldGiveCredits) {
      const { credits } = await updateCredits(user.id, 3, "reward");
      if (!credits) {
        return NextResponse.json(
          { error: "Error updating credits" },
          { status: 500 }
        );
      }
      return NextResponse.json({
        ...data,
        bonusCredits: 3,
        newCreditBalance: credits.actual,
      });
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
