import { updateCredits } from "@/lib/credits";
import { getImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { packId, posture, background, cost, startTime } = await req.json();

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: pack } = await supabase
    .from("faceless_packs")
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
    background,
    user.id
  );

  if (!image) {
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }

  const credits = Math.round((image.cost + cost) * 100);

  const timeForImage = performance.now() - startTime;
  const timeForImageInSeconds = timeForImage / 1000;
  // Create a new photo
  const { data: photoData, error: photoError } = await supabase
    .from("faceless_photos")
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
      timeForImage: timeForImageInSeconds,
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

  const { credits: updatedCredits } = await updateCredits(
    user.id,
    -credits,
    "generate"
  );

  if (!updatedCredits) {
    return NextResponse.json(
      { error: "Failed to update credits" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: {
      pack: pack,
      photos: [photoData],
      actualCredits: updatedCredits.actual,
    },
  });
}
