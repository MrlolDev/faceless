import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { serviceRole } from "@/lib/supabase/service-role";

export async function middleware(request: NextRequest) {
  // Check for cookie consent before loading analytics
  const cookieConsent = request.cookies.get("cookie-consent");
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/pic")) {
    const photoFile = request.nextUrl.pathname.split("/pic/")[1];
    const imageUrl = `https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/${photoFile}.webp`;
    // response render image
    return NextResponse.rewrite(imageUrl);
  }

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

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/_next/script/google-analytics",
  ],
};
