"use client";

import { useState } from "react";
import Image from "next/image";

const EXTENSIONS = ["jpg", "png", "webp", "jpeg"];

export default function ProductImage({
  slug,
  alt,
  brand,
  category,
  className,
  sizes,
  priority,
}: {
  slug: string;
  alt: string;
  brand: string;
  category?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [attempt, setAttempt] = useState(0);
  const failed = attempt >= EXTENSIONS.length;

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-navy to-[#122c52] px-4 text-brand-white ${className ?? ""}`}
      >
        <Image
          src="/brand/mark-white.png"
          alt=""
          width={64}
          height={28}
          className="h-7 w-auto opacity-80"
        />
        <div className="text-center">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-white/90">
            {brand}
          </p>
          <p className="mt-0.5 text-[11px] text-white/55">
            {category ?? "Kicking Tee"} · photo coming soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      key={attempt}
      src={`/products/${slug}.${EXTENSIONS[attempt]}`}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
      className={className}
      style={{ objectFit: "contain" }}
      onError={() => setAttempt((a) => a + 1)}
      priority={priority}
      unoptimized
    />
  );
}
