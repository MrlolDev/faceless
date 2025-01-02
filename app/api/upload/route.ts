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

    // Run validations in parallel
    const [buffer, tokenVerified, supabase] = await Promise.all([
      file.arrayBuffer(),
      verifyTurnstileToken(captchaToken),
      createClient(),
    ]);

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!tokenVerified) {
      return NextResponse.json(
        { error: "Invalid captcha token" },
        { status: 400 }
      );
    }

    // Quick file size check before processing
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Validate image in parallel with user authentication
    const metadata = await sharp(buffer, { failOnError: false }).metadata();

    // Image validation
    if (!metadata?.width || !metadata?.height || !metadata?.format) {
      return NextResponse.json(
        { error: "Invalid image metadata" },
        { status: 400 }
      );
    }

    if (metadata.width > 8000 || metadata.height > 8000) {
      return NextResponse.json(
        { error: "Image dimensions too large" },
        { status: 400 }
      );
    }

    if (!["jpeg", "jpg", "png", "webp", "gif"].includes(metadata.format)) {
      return NextResponse.json(
        { error: "Unsupported image format" },
        { status: 400 }
      );
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
