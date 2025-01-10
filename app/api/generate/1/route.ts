import { getCharacterDescription } from "@/lib/llm";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageURL } = await req.json();

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: creditsDataExist, error: creditsErrorExist } = await supabase
    .from("faceless_credits")
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

  const characterDescription = await getCharacterDescription(imageURL);
  if (!characterDescription || !characterDescription.description) {
    return NextResponse.json(
      { error: "Failed to get character description" },
      { status: 500 }
    );
  }

  // Create a new pack
  const { data: packData } = await supabase
    .from("faceless_packs")
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

  return NextResponse.json({
    data: {
      pack: packData,
      cost: characterDescription.cost,
    },
  });
}
