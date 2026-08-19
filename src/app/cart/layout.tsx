import type { Metadata } from "next";

// Personalised, localStorage-driven cart contents — nothing here for a
// crawler to index.
export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
