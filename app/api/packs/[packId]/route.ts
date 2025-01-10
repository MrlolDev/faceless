import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ packId: string }> }
) {
  const params = await props.params;
  const { packId } = params;
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("faceless_packs")
    .select("*")
    .eq("id", packId)
    .eq("userId", user.id)
    .single();
  return NextResponse.json({ data, error }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ packId: string }> }
) {
  const params = await props.params;
  const { packId } = params;
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // First verify the pack belongs to the user
  const { data: pack, error: packError } = await supabase
    .from("faceless_packs")
    .select("userId, originPhoto")
    .eq("id", packId)
    .single();

  if (packError || !pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  if (pack.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // delete the original image from the bucket
  const originPhoto = pack.originPhoto; // url of the uploaded photo
  const { error: originPhotoError } = await supabase.storage
    .from("faceless_packs")
    .remove([originPhoto]);

  if (originPhotoError) {
    console.error("Error deleting original image", originPhotoError);
    return NextResponse.json(
      { error: "Failed to delete original image" },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("faceless_packs")
    .delete()
    .eq("id", packId)
    .eq("userId", user.id);

  return NextResponse.json({ data, error }, { status: 200 });
}
