import { ImageResponse } from "next/og";
import { prisma } from "@/app/lib/prisma";

export const alt = "Clinkdeck build";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: { creator: true },
  });

  const title = listing?.title ?? "Clinkdeck";
  const summary = listing?.summary ?? "Where AI builders showcase their talent.";
  const creatorName = listing?.creator.name ?? "";
  const creatorHandle = listing?.creator.handle ?? "";
  const heroColor = listing?.themeColor ?? "#0ea5e9";
  const avatarColor = listing?.creator.avatarColor ?? "#f43f5e";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${heroColor}, ${shift(heroColor)})`,
          padding: 64,
          color: "white",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: 0.85,
            fontSize: 26,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background:
                "linear-gradient(135deg, #06b6d4, #14b8a6)",
            }}
          />
          Clinkdeck
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 980,
              letterSpacing: -1.5,
            }}
          >
            {truncate(title, 90)}
          </div>
          <div
            style={{
              fontSize: 32,
              opacity: 0.85,
              marginTop: 24,
              maxWidth: 980,
              lineHeight: 1.3,
            }}
          >
            {truncate(summary, 140)}
          </div>
        </div>

        {creatorName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 28,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: avatarColor,
                border: "3px solid rgba(255,255,255,0.7)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontWeight: 600 }}>{creatorName}</div>
              <div style={{ opacity: 0.7, fontSize: 22 }}>
                {`@${creatorHandle}`}
              </div>
            </div>
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}

function shift(hex: string) {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `#${[Math.max(0, r - 50), Math.max(0, g - 30), Math.min(255, b + 60)]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
}

function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}
