/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  webpack: (config: any, { isServer }: any) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        encoding: false,
        "node-fetch": false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "replicate.delivery",
        pathname: "/**",
      },
      {
        protocol: "https" as const,
        hostname: "kbthrjuoewftreopxkiq.supabase.co",
        pathname: "/**",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              // Scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-analytics.com https://*.google-analytics.com https://*.googletagmanager.com https://challenges.cloudflare.com;",
              // Styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              // Images
              "img-src 'self' data: blob: https://*.supabase.co https://replicate.delivery https://*.google-analytics.com;",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com;",
              // Frames
              "frame-src 'self' https://challenges.cloudflare.com;",
              // Connect (for API calls, websockets)
              "connect-src 'self' blob: https://*.supabase.co https://*.vercel-analytics.com https://*.google-analytics.com https://replicate.delivery https://challenges.cloudflare.com;",
              // Media
              "media-src 'self';",
              // Object
              "object-src 'none';",
              // Manifest
              "manifest-src 'self';",
              // Form
              "form-action 'self';",
              // Base URI
              "base-uri 'self';",
              // Frame ancestors
              "frame-ancestors 'none';",
              // Upgrade insecure requests
              "upgrade-insecure-requests;",
            ].join(" "),
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
