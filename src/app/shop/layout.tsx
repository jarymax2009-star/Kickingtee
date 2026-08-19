import type { Metadata } from "next";
import { getAllTees, getBrands } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

const teeCount = getAllTees().length;
const brandCount = getBrands().length;

const title = "Shop Rugby Kicking Tees — Filter by Spec";
const description = `Browse ${teeCount} rugby kicking tees from ${brandCount} brands — Rugby Bricks, Gilbert, Optimum, Rhino Rugby, Dan Carter and more. Filter by height, adjustment mechanism, base diameter, cup angle, weight, material and grip.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/shop" },
  openGraph: { title, description, url: "/shop" },
  twitter: { title, description },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
  ],
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
