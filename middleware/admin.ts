import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function adminMiddleware() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || user.email !== "mrlol.yt.oficial@gmail.com") {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_URL!));
  }

  return NextResponse.next();
}
