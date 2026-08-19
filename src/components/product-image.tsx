"use client";

import { useState } from "react";
import Image from "next/image";
import imageManifest from "@/lib/image-manifest.json";

const MANIFEST: Record<string, string> = imageManifest;

function isLight(hex: string) {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 190;
}

export default function ProductImage({
  slug,
  alt,
  brand,
  category,
  className,
  sizes,
  priority,
  tintHex,
}: {
  slug: string;
  alt: string;
  brand: string;
  category?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Selected colourway hex — tints the placeholder when no real photo exists. */
  tintHex?: string;
}) {
  const ext = MANIFEST[slug];
  const [failed, setFailed] = useState(!ext);

  if (failed || !ext) {
    const light = tintHex ? isLight(tintHex) : false;
    const textPrimary = light ? "text-brand-navy/90" : "text-white/90";
    const textSecondary = light ? "text-brand-navy/55" : "text-white/55";
    const markSrc = light ? "/brand/mark.png" : "/brand/mark-white.png";

    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 px-4 ${
          tintHex ? "" : "bg-gradient-to-br from-brand-navy to-[#122c52]"
        } ${className ?? ""}`}
        style={
          tintHex
            ? { background: `linear-gradient(135deg, ${tintHex}, ${tintHex}dd)` }
            : undefined
        }
      >
        <Image
          src={markSrc}
          alt=""
          width={584}
          height={248}
          className="h-7 w-auto opacity-80"
        />
        <div className="text-center">
          <p className={`font-display text-xs font-bold uppercase tracking-wide ${textPrimary}`}>
            {brand}
          </p>
          <p className={`mt-0.5 text-[11px] ${textSecondary}`}>
            {category ?? "Kicking Tee"} · photo coming soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={`/products/${slug}.${ext}`}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
      className={className}
      style={{ objectFit: "contain" }}
      onError={() => setFailed(true)}
      priority={priority}
    />
  );
}
