import { createClient } from "@/lib/supabase/server";
import { serviceRole } from "@/lib/supabase/service-role";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if code exists and is valid
    const { data: codeData, error: codeError } = await serviceRole
      .from("codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (codeError || !codeData) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // Check if code has expired
    if (new Date(codeData.expires_at) < new Date()) {
      await serviceRole
        .from("codes")
        .update({ is_active: false })
        .eq("id", codeData.id);
      return NextResponse.json({ error: "Code has expired" }, { status: 400 });
    }

    // Check if user has already used this code
    if (codeData.usedBy.includes(user.id)) {
      return NextResponse.json(
        { error: "You've already used this code" },
        { status: 400 }
      );
    }

    // Check if code has reached max uses
    if (codeData.usedBy.length >= codeData.maxUses) {
      return NextResponse.json(
        { error: "Code has reached maximum uses" },
        { status: 400 }
      );
    }

    // Get user's current credits
    const { data: creditsData, error: creditsError } = await serviceRole
      .from("credits")
      .select("*")
      .eq("userId", user.id)
      .single();

    if (creditsError) {
      return NextResponse.json(
        { error: "Failed to fetch credits" },
        { status: 500 }
      );
    }

    // Update code usage
    const { error: updateCodeError } = await serviceRole
      .from("codes")
      .update({
        usedBy: [...codeData.usedBy, user.id],
        is_active: codeData.usedBy.length + 1 >= codeData.maxUses,
      })
      .eq("id", codeData.id);

    if (updateCodeError) {
      return NextResponse.json(
        { error: "Failed to update code" },
        { status: 500 }
      );
    }

    // Update user's credits
    const { data: updatedCredits, error: updateCreditsError } =
      await serviceRole
        .from("credits")
        .update({
          actual: creditsData.actual + codeData.credits,
          transactions: [
            ...(creditsData.transactions || []),
            {
              type: "code",
              amount: codeData.credits,
              createdAt: new Date().toISOString(),
              code: code,
            },
          ],
        })
        .eq("userId", user.id)
        .select()
        .single();

    if (updateCreditsError) {
      return NextResponse.json(
        { error: "Failed to update credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      credits: codeData.credits,
      actualCredits: updatedCredits.actual,
    });
  } catch (error) {
    console.error("Error in claim code route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
