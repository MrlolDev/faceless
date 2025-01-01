import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { serviceRole } from "@/lib/supabase/service-role";

export async function middleware(request: NextRequest) {
  // Check for cookie consent before loading analytics
  const cookieConsent = request.cookies.get("cookie-consent");
  const response = NextResponse.next();

  // Block Google Analytics if no consent
  if (!cookieConsent && request.nextUrl.pathname.includes("google-analytics")) {
    return new NextResponse(null, { status: 451 });
  }

  // Allow direct access to the landing page
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/terms" ||
    request.nextUrl.pathname === "/privacy"
  ) {
    return response;
  }
  if (request.nextUrl.pathname.startsWith("/photo")) {
    const photoId = request.nextUrl.pathname.split("/")[2];
    const { data: photoData, error: photoError } = await serviceRole
      .from("photos")
      .select("*")
      .eq("id", photoId)
      .single();
    if (photoError) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
    const imageUrl = photoData.imageUrl;
    // response render image
    return NextResponse.rewrite(imageUrl);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/_next/script/google-analytics",
  ],
};
