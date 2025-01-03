import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { serviceRole } from "@/lib/supabase/service-role";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const locales = ["en", "es"];
const publicPages = [
  "/",
  "/terms",
  "/privacy",
  "/sitemap.xml",
  "/robots.txt",
  "/api/webhook/polar",
];

// Combine next-intl with existing middleware
export async function middleware(request: NextRequest) {
  const handleI18n = createMiddleware(routing);

  // Handle i18n first
  const i18nResponse = await handleI18n(request);
  if (i18nResponse) return i18nResponse;

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
  if (publicPages.includes(request.nextUrl.pathname)) {
    return response;
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/_next/script/google-analytics",
    "/((?!api|_next|.*\\..*).*)",
  ],
};
