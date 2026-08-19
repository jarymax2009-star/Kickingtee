import type { Metadata } from "next";

// A transactional confirmation page tied to one specific order — never
// something a search engine should index.
export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
