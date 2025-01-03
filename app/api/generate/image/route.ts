import { getImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/server";
import { serviceRole } from "@/lib/supabase/service-role";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { packId, posture, background, cost } = await req.json();

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: pack } = await supabase
    .from("packs")
    .select("*")
    .eq("id", packId)
    .single();

  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  const image = await getImage(
    pack.originPhoto,
    pack.characterDescription,
    posture,
    background
  );

  if (!image) {
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }

  const credits = Math.round((image.cost + cost) * 100);

  // Run photo creation and credits update in parallel
  const [photoResult, creditsResult] = await Promise.all([
    // Create photo
    supabase
      .from("photos")
      .insert({
        packId: pack.id,
        imgUrl: image.imgUrl,
        prompt: image.prompt,
        steps: image.steps,
        baseModel: image.baseModel,
        prompt_strength: image.promptStrength,
        facelessVersion: image.facelessVersion,
        credits: credits,
        rating: 0,
        userId: user.id,
      })
      .select()
      .single(),

    // Get and update credits
    (async () => {
      const { data: creditsData, error: creditsError } = await serviceRole
        .from("credits")
        .select("*")
        .eq("userId", user.id)
        .single();

      if (!creditsData || creditsError) {
        throw new Error("Failed to get credits");
      }

      const actualCredits = creditsData.actual - credits;
      const spentCredits = creditsData.spent + credits;

      const { data: updatedCredits, error: updateError } = await serviceRole
        .from("credits")
        .update({
          actual: actualCredits,
          spent: spentCredits,
          transactions: [
            ...(creditsData.transactions || []),
            {
              type: "generate",
              amount: credits,
              createdAt: new Date().toISOString(),
            },
          ],
        })
        .eq("userId", user.id)
        .select();

      if (!updatedCredits || updateError) {
        throw new Error("Failed to update credits");
      }

      return { actualCredits, updatedCredits };
    })(),
  ]).catch((error) => {
    console.error(error);
    throw error;
  });

  const [{ data: photoData }, { actualCredits }] = photoResult;

  if (!photoData) {
    return NextResponse.json(
      { error: "Failed to create photo" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: {
      pack: pack,
      photos: [photoData],
      actualCredits: actualCredits,
    },
  });
}
