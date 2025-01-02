import { createClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const captchaToken = formData.get("captchaToken") as string;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Validate that the file is an image
    const buffer = await file.arrayBuffer();
    let metadata;
    try {
      // This will throw an error if the file is not a valid image
      metadata = await sharp(buffer).metadata();

      // Verify the image has valid dimensions and format
      if (!metadata.width || !metadata.height || !metadata.format) {
        return NextResponse.json(
          { error: "Invalid image metadata" },
          { status: 400 }
        );
      }

      // Check for reasonable image dimensions
      if (metadata.width > 8000 || metadata.height > 8000) {
        return NextResponse.json(
          { error: "Image dimensions too large" },
          { status: 400 }
        );
      }

      // Verify it's a common image format
      const allowedFormats = ["jpeg", "jpg", "png", "webp", "gif"];
      if (!allowedFormats.includes(metadata.format)) {
        return NextResponse.json(
          { error: "Unsupported image format" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Invalid image file" },
        { status: 400 }
      );
    }

    // File size check (moved after metadata validation)
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

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
    if (creditsDataExist.actual <= 0) {
      return NextResponse.json(
        { error: "No credits available" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.storage
      .from("packs")
      .upload(`${user.id}/original/${Date.now()}-${file.name}`, file);

    if (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrl } = supabase.storage
      .from("packs")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl.publicUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
