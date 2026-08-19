import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "KickingTee.com — Compare Rugby Kicking Tees";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public", "brand", "mark-white.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

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
        <img src={logoSrc} width={220} height={94} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 64,
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          Kicking<span style={{ color: "#3399FF" }}>Tee</span>.com
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 32,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
          }}
        >
          Compare rugby kicking tees by spec, not guesswork
        </div>
      </div>
    ),
    { ...size }
  );
}
