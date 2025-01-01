import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Faceless Avatar - AI Avatar Generator",
  description:
    "Generate unique AI avatars with Faceless Avatar. Transform your photos into stunning AI-generated portraits with our advanced image generation technology.",
  keywords: [
    "AI avatar",
    "avatar generator",
    "AI portrait",
    "profile picture generator",
    "artificial intelligence",
    "digital avatar",
  ],
  authors: [{ name: "MrlolDev" }],
  openGraph: {
    title: "Faceless Avatar - AI Avatar Generator",
    description: "Transform your photos into stunning AI-generated avatars",
    url: "https://faceless-avatar.com",
    siteName: "Faceless Avatar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Faceless Avatar - AI Avatar Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faceless Avatar - AI Avatar Generator",
    description: "Transform your photos into stunning AI-generated avatars",
    creator: "@samuelbreznjak",
    images: ["/og-image.jpg"],
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
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
