import { getImage } from "@/lib/image";
import { getCharacterDescription } from "@/lib/llm";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageURL } = await req.json();
  console.log(imageURL);
  const supabase = await createClient();
  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // we get the character description from the user
  const characterDescription = await getCharacterDescription(imageURL);
  if (!characterDescription || !characterDescription.description) {
    return NextResponse.json(
      { error: "Failed to get character description" },
      { status: 500 }
    );
  }
  // create a new pack
  const { data: packData, error: packError } = await supabase
    .from("packs")
    .insert({
      userId: user.id,
      characterDescription: characterDescription,
      originPhoto: imageURL,
    })
    .select();

  if (!packData) {
    console.log(packError);
    return NextResponse.json(
      { error: "Failed to create pack" },
      { status: 500 }
    );
  }
  const image = await getImage(imageURL, characterDescription.description);
  if (!image) {
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }

  const USDcost = characterDescription.cost + image.cost;
  // 1cent = 1credit
  const credits = USDcost * 100;
  // create a new photo
  const { data: photoData, error: photoError } = await supabase
    .from("photos")
    .insert({
      packId: packData[0].id,
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
    .eq("userId", user.id);

  if (!creditsData) {
    console.log(creditsError);
    return NextResponse.json(
      { error: "Failed to get credits" },
      { status: 500 }
    );
  }
  const actualCredits = creditsData[0].actual - credits;
  const spentCredits = creditsData[0].spent + credits;
  const { data: creditsUpdateData, error: creditsUpdateError } = await supabase
    .from("credits")
    .update({
      actual: actualCredits,
      spent: spentCredits,
      transactions: [
        ...(creditsData[0].transactions || []),
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
      pack: packData,
      photos: [photoData],
    },
    error: photoError,
  });
}
