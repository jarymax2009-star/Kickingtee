import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";

const title = "Terms of Use";
const description = "The terms for using KickingTee.com, an independent rugby kicking tee comparison site.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title, description, url: "/terms", images: ["/opengraph-image"] },
  twitter: { title, description },
};

const linkClass = "text-brand-blue underline underline-offset-2 hover:no-underline";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-brand-navy">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-brand-grey">Last updated: 29 October 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-brand-navy/85 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-brand-navy [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p+p]:mt-2">
        <section>
          <h2>1. Who we are</h2>
          <p>
            KickingTee.com (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an
            independent comparison site for rugby kicking tees, run by Max
            Jary as a sole trader in England. You can contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a>.
          </p>
          <p>By using this site you agree to these terms.</p>
        </section>

        <section>
          <h2>2. What this site does</h2>
          <p>
            We collect specifications and prices for kicking tees from many
            brands so you can compare them in one place. We do not sell
            tees. When you click a &ldquo;View on&rdquo; link you leave our
            site, and any purchase is made directly with that manufacturer
            or retailer, on their terms.
          </p>
        </section>

        <section>
          <h2>3. Accuracy of information</h2>
          <p>
            We work hard to keep specs and prices accurate, but they come
            from manufacturers, retailers and our own measurements, and they
            can change without notice. Each price is labelled as confirmed,
            listed or estimated. Always check the price, stock, delivery
            cost and specification on the seller&apos;s own site before you
            buy. We are not responsible for a seller&apos;s products,
            delivery, returns or customer service.
          </p>
        </section>

        <section>
          <h2>4. Independence</h2>
          <p>
            No brand pays to be listed or to appear higher on this site. If
            we ever earn commission from links (affiliate links), we will
            say so clearly on the page and update these terms.
          </p>
        </section>

        <section>
          <h2>5. Links to other sites</h2>
          <p>
            We link to third-party websites for convenience. We don&apos;t
            control those sites and aren&apos;t responsible for their
            content, products or privacy practices.
          </p>
        </section>

        <section>
          <h2>6. Using our content</h2>
          <p>
            The site design, logo, text, comparison data and test ratings
            belong to KickingTee.com. You&apos;re welcome to share links to
            our pages, but please don&apos;t copy our data or content in bulk
            without permission. Brand names and product names belong to
            their respective owners.
          </p>
        </section>

        <section>
          <h2>7. Our liability</h2>
          <p>
            The site is provided free of charge and &ldquo;as is&rdquo;. As
            far as the law allows, we are not liable for any loss arising
            from your use of the site or reliance on its information.
            Nothing in these terms limits liability that cannot be limited
            under English law.
          </p>
        </section>

        <section>
          <h2>8. Changes and governing law</h2>
          <p>
            We may update these terms from time to time; the current version
            is always on this page. These terms are governed by the law of
            England and Wales.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            Questions, corrections or brands wanting to update a listing:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a>.
            See also our{" "}
            <a href="/privacy" className={linkClass}>Privacy Policy</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
