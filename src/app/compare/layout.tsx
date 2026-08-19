import type { Metadata } from "next";

// Personalised, localStorage-driven selection — nothing here for a
// crawler to index, so keep it out of search results and the sitemap.
export const metadata: Metadata = {
  title: "Compare Tees",
  robots: { index: false, follow: true },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
