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
      .from("photos")
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
      // Get current credits
      const { data: creditsData, error: creditsError } = await serviceRole
        .from("credits")
        .select("*")
        .eq("userId", user.id)
        .single();

      if (creditsError) {
        console.error("Error fetching credits:", creditsError);
      } else {
        // Update credits
        const { error: updateError } = await serviceRole
          .from("credits")
          .update({
            actual: creditsData.actual + 3,
            transactions: [
              ...(creditsData.transactions || []),
              {
                type: "reward",
                amount: 3,
                createdAt: new Date().toISOString(),
              },
            ],
          })
          .eq("userId", user.id);

        if (updateError) {
          console.error("Error updating credits:", updateError);
        }
      }

      return NextResponse.json({
        ...data,
        bonusCredits: 3,
        newCreditBalance: creditsData.actual + 3,
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
