import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Run validations in parallel
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // File validation
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image format" },
        { status: 400 }
      );
    }

    // File size check
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB" },
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
    const fileExtension = file.type.split("/")[1];

    const { data, error } = await supabase.storage
      .from("packs")
      .upload(`${user.id}/original/${Date.now()}.${fileExtension}`, file);

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
