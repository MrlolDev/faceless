import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Faceless Avatar - AI Avatar Generator",
    template: "%s | Faceless Avatar",
  },
  description:
    "Transform your photos into stunning AI-generated avatars with Faceless Avatar. Create unique, professional profile pictures using advanced AI technology. Free credits for new users.",
  keywords: [
    "AI avatar generator",
    "profile picture generator",
    "artificial intelligence avatar",
    "digital avatar creator",
    "AI portrait generator",
    "professional profile picture",
    "avatar maker",
    "AI photo transformation",
    "custom avatar generator",
    "personalized avatar",
  ],
  authors: [{ name: "MrlolDev" }],
  creator: "MrlolDev",
  publisher: "Faceless Avatar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://faceless-avatar.com",
    languages: {
      en: "https://faceless-avatar.com/en",
      es: "https://faceless-avatar.com/es",
      fr: "https://faceless-avatar.com/fr",
      de: "https://faceless-avatar.com/de",
      pt: "https://faceless-avatar.com/pt",
      it: "https://faceless-avatar.com/it",
      nl: "https://faceless-avatar.com/nl",
      ru: "https://faceless-avatar.com/ru",
    },
  },
  openGraph: {
    title: "Faceless Avatar - AI Avatar Generator",
    description:
      "Transform your photos into stunning AI-generated avatars. Create unique, professional profile pictures in seconds.",
    url: "https://faceless-avatar.com",
    siteName: "Faceless Avatar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Faceless Avatar - AI Avatar Generator Examples",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faceless Avatar - AI Avatar Generator",
    description:
      "Transform your photos into stunning AI-generated avatars. Create unique, professional profile pictures in seconds.",
    creator: "@mrloldev",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Footer />
        </ThemeProvider>
        <GoogleAnalytics gaId="G-6KT1M005LZ" />
      </body>
    </html>
  );
}
