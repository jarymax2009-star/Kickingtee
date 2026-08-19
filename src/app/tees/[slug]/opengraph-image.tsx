import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { formatPrice, getAllTees, getTeeBySlug } from "@/lib/products";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllTees().map((t) => ({ slug: t.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tee = getTeeBySlug(slug);
  return [
    {
      id: "og",
      alt: tee ? `${tee.brand} ${tee.model}` : "KickingTee.com",
      size,
      contentType,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tee = getTeeBySlug(slug);

  const logoData = await readFile(
    join(process.cwd(), "public", "brand", "mark-white.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  if (!tee) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0B1F3A",
            color: "#FFFFFF",
            fontSize: 48,
          }}
        >
          KickingTee.com
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0B1F3A 0%, #122c52 100%)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logoSrc} width={56} height={24} alt="" />
          <div
            style={{
              display: "flex",
              marginLeft: 14,
              fontSize: 26,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Kicking<span style={{ color: "#3399FF" }}>Tee</span>.com
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#3399FF",
            }}
          >
            {tee.brand}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontSize: 64,
              fontWeight: 700,
              color: "#FFFFFF",
              maxWidth: 900,
            }}
          >
            {tee.model}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              gap: 16,
              alignItems: "center",
            }}
          >
            {tee.category && (
              <div
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.12)",
                  color: "#FFFFFF",
                  fontSize: 24,
                }}
              >
                {tee.category}
              </div>
            )}
            {tee.code && (
              <div
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.12)",
                  color: "#FFFFFF",
                  fontSize: 24,
                }}
              >
                {tee.code}
              </div>
            )}
            <div
              style={{
                display: "flex",
                fontSize: 40,
                fontWeight: 700,
                color: "#FFFFFF",
                marginLeft: 8,
              }}
            >
              {formatPrice(tee.priceGBP)}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
