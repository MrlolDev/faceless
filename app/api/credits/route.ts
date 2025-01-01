import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Credits } from "@/types/credits";

export async function GET() {
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

    // Using service role to fetch credits
    const { data: credits, error: creditsError } = await supabase
      .from("credits")
      .select("*")
      .eq("userId", user.id)
      .single();

    // If no credits record exists, create one with default values
    if (!credits) {
      const { data: newCredits, error: createError } = await supabase
        .from("credits")
        .insert([
          {
            userId: user.id,
            actual: 10,
            spent: 0,
            transactions: [],
          },
        ])
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { error: "Failed to create credits" },
          { status: 500 }
        );
      }

      return NextResponse.json(newCredits);
    }

    if (creditsError) {
      return NextResponse.json(
        { error: "Failed to fetch credits" },
        { status: 500 }
      );
    }

    return NextResponse.json(credits);
  } catch (error) {
    console.error("Error in credits route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
