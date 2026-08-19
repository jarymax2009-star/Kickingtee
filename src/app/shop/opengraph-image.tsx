import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getAllTees, getBrands } from "@/lib/products";

export const alt = "Shop rugby kicking tees on KickingTee.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public", "brand", "mark-white.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;
  const teeCount = getAllTees().length;
  const brandCount = getBrands().length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B1F3A 0%, #122c52 100%)",
          padding: 80,
        }}
      >
        <img src={logoSrc} width={80} height={34} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 60,
            fontWeight: 700,
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Shop Rugby Kicking Tees
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 30,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
          }}
        >
          {teeCount} tees from {brandCount} brands — filter by real specs
        </div>
      </div>
    ),
    { ...size }
  );
}
