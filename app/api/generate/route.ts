import { getImage } from "@/lib/image";
import { getCharacterDescription } from "@/lib/llm";
import { createClient } from "@/lib/supabase/server";
import { serviceRole } from "@/lib/supabase/service-role";
import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  const { imageURL, packId, posture, background, captchaToken } =
    await req.json();

  const tokenVerified = await verifyTurnstileToken(captchaToken);
  if (!tokenVerified) {
    return NextResponse.json(
      { error: "Invalid captcha token" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: creditsDataExist, error: creditsErrorExist } = await supabase
    .from("credits")
    .select("*")
    .eq("userId", user.id)
    .single();
  if (!creditsDataExist) {
    console.log(creditsErrorExist);
    return NextResponse.json(
      { error: "Failed to get credits" },
      { status: 500 }
    );
  }
  if (creditsDataExist.actual < 1) {
    return NextResponse.json(
      { error: "You don't have enough credits" },
      { status: 400 }
    );
  }
  let description;
  let USDcost = 0;
  let pack;
  if (!packId) {
    // we get the character description from the user
    const characterDescription = await getCharacterDescription(imageURL);
    if (!characterDescription || !characterDescription.description) {
      return NextResponse.json(
        { error: "Failed to get character description" },
        { status: 500 }
      );
    }
    description = characterDescription.description;
    USDcost = characterDescription.cost;
    // create a new pack
    const { data: packData } = await supabase
      .from("packs")
      .insert({
        userId: user.id,
        characterDescription: characterDescription.description,
        originPhoto: imageURL,
      })
      .select()
      .single();

    if (!packData) {
      return NextResponse.json(
        { error: "Failed to create pack" },
        { status: 500 }
      );
    }
    pack = packData;
  } else {
    const { data: packData } = await supabase
      .from("packs")
      .select("*")
      .eq("id", packId)
      .single();
    if (!packData) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 });
    }
    description = packData.characterDescription;
    pack = packData;
  }
  const image = await getImage(imageURL, description, posture, background);
  if (!image) {
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }

  USDcost = USDcost + image.cost;
  // 1cent = 1credit
  const credits = Math.round(USDcost * 100);
  // create a new photo
  const { data: photoData, error: photoError } = await supabase
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
    .single();
  if (!photoData) {
    console.log(photoError);
    return NextResponse.json(
      { error: "Failed to create photo" },
      { status: 500 }
    );
  }
  const { data: creditsData, error: creditsError } = await supabase
    .from("credits")
    .select("*")
    .eq("userId", user.id)
    .single();

  if (!creditsData) {
    console.log(creditsError);
    return NextResponse.json(
      { error: "Failed to get credits" },
      { status: 500 }
    );
  }
  const actualCredits = creditsData.actual - credits;
  console.log("actualCredits", actualCredits);
  const spentCredits = creditsData.spent + credits;
  const { data: creditsUpdateData, error: creditsUpdateError } =
    await serviceRole
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
  if (!creditsUpdateData) {
    console.log(creditsUpdateError);
    return NextResponse.json(
      { error: "Failed to update credits" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: {
      pack: pack,
      photos: [photoData],
      actualCredits: actualCredits,
    },
    error: photoError,
  });
}
