import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent the page from being framed by another site (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Don't sniff content types — keeps a maliciously-uploaded file from
  // being interpreted as a script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Trim referrer info on cross-origin links so we don't leak listing
  // slugs / inquiry IDs to outside sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful APIs we don't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Force HTTPS for a year. Production only so localhost doesn't get
  // HSTS-pinned in the developer's browser.
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
