import { updateCredits } from "@/lib/credits";
import { removeBackground } from "@/lib/image";
import { createClient } from "@/lib/supabase/server";
import { serviceRole } from "@/lib/supabase/service-role";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ photoId: string }> }
) {
  const params = await props.params;
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(userError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await serviceRole
      .from("photos")
      .select("*")
      .eq("id", parseInt(params.photoId))
      .eq("userId", user.id)
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error fetching photo" },
        { status: 500 }
      );
    }
    if (data.noBackgroundImgUrl) {
      return NextResponse.json({
        bgRemovedImage: data.noBackgroundImgUrl,
        photoData: data,
      });
    }
    const bgRemovedImage = await removeBackground(data.imgUrl);

    const { credits: updatedCredits } = await updateCredits(
      user.id,
      -1,
      "remove-bg"
    );

    if (!updatedCredits) {
      console.error(updatedCredits);
      return NextResponse.json(
        { error: "Failed to update credits" },
        { status: 500 }
      );
    }

    // upload the bgRemovedImage to the storage and add a new row to the photos table

    const res = await fetch(bgRemovedImage);
    const bgRemovedImageBlob = await res.blob();

    const { data: uploadData, error: uploadError } = await serviceRole.storage
      .from("packs")
      .upload(`${user.id}/generated/${Date.now()}.png`, bgRemovedImageBlob, {
        contentType: "image/png",
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "Failed to upload bgRemovedImage" },
        { status: 500 }
      );
    }
    const {
      data: { publicUrl },
    } = serviceRole.storage.from("packs").getPublicUrl(uploadData.path);
    delete data.id;
    const { data: photoData, error: photoError } = await serviceRole
      .from("photos")
      .update({
        noBackgroundImgUrl: publicUrl,
        credits: data.credits + 1,
      })
      .eq("id", parseInt(params.photoId))
      .eq("userId", user.id)
      .select()
      .single();

    if (photoError) {
      console.error(photoError);
      return NextResponse.json(
        { error: "Failed to update photo" },
        { status: 500 }
      );
    }
    console.log(photoData);

    return NextResponse.json({ bgRemovedImage: publicUrl, photoData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove background" },
      { status: 500 }
    );
  }
}
