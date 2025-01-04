import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const publicPages = ["/", "/terms", "/privacy"];
const withoutLocale = [
  "/api",
  "models",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

// Combine next-intl with existing middleware
export async function middleware(request: NextRequest) {
  const handleI18n = createMiddleware({
    ...routing,
    localePrefix: "always",
    defaultLocale: "en",
    localeDetection: false,
  });

  // Check for language cookie
  const localeCookie = request.cookies.get("NEXT_LOCALE");
  if (localeCookie && routing.locales.includes(localeCookie.value as any)) {
    // Override locale if valid cookie exists
    request.headers.set("x-next-locale", localeCookie.value);
  }

  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/pic")) {
    const photoFile = request.nextUrl.pathname.split("/pic/")[1];
    const imageUrl = `https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/${photoFile}.webp`;
    // response render image
    return NextResponse.rewrite(imageUrl);
  }
  if (withoutLocale.includes(request.nextUrl.pathname)) {
    return response;
  }

  // Handle i18n first
  const i18nResponse = await handleI18n(request);
  if (i18nResponse) return i18nResponse;

  // Check for cookie consent before loading analytics
  const cookieConsent = request.cookies.get("cookie-consent");

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
