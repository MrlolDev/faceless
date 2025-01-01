import { createClient } from "@/lib/supabase/server";
import { serviceRole } from "@/lib/supabase/service-role";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || user.email !== "mrlol.yt.oficial@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await serviceRole
      .from("codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch codes" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in admin codes route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { code, credits, maxUses, expires_at } = await req.json();

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.email !== "mrlol.yt.oficial@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await serviceRole.from("codes").insert({
    code,
    credits,
    maxUses,
    expires_at,
    usedBy: [],
  });
  if (error) {
    console.error("Error in admin codes route:", error);
    return NextResponse.json(
      { error: "Failed to create code" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "Code created successfully" },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.email !== "mrlol.yt.oficial@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { error } = await serviceRole.from("codes").delete().eq("id", id);
  if (error) {
    console.error("Error in admin codes route:", error);
    return NextResponse.json(
      { error: "Failed to delete code" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "Code deleted successfully" },
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest) {
  const { id, is_active } = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.email !== "mrlol.yt.oficial@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { error } = await serviceRole
    .from("codes")
    .update({ is_active })
    .eq("id", id);
  if (error) {
    console.error("Error in admin codes route:", error);
    return NextResponse.json(
      { error: "Failed to update code" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "Code updated successfully" },
    { status: 200 }
  );
}
