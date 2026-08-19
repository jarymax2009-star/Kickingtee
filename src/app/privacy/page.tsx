import type { Metadata } from "next";
import LegalDraftNotice from "@/components/legal-draft-notice";

const title = "Privacy Policy";
const description = "How KickingTee.com collects, uses, and protects your data.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title, description, url: "/privacy", images: ["/opengraph-image"] },
  twitter: { title, description },
  // Draft content with [bracketed placeholders] instead of real company
  // details — keep it out of search results until it's finalised, then
  // remove this once real details are filled in.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-brand-navy">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-brand-grey">
        Last updated: [insert date] · Draft version 1.0
      </p>

      <LegalDraftNotice />

      <div className="space-y-8 text-sm leading-relaxed text-brand-navy/85 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-brand-navy [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p+p]:mt-2">
        <section>
          <h2>1. Who we are</h2>
          <p>
            KickingTee.com is operated by [Company Legal Name] (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;), of [Registered Address]. We are the data
            controller for the personal data described in this policy. You
            can contact us about privacy matters at
            [privacy@kickingtee.com].
          </p>
        </section>

        <section>
          <h2>2. What data we collect</h2>
          <ul>
            <li>
              <strong>Order &amp; account data:</strong> name, delivery and
              billing address, email, phone number, and order history.
            </li>
            <li>
              <strong>Payment data:</strong> processed directly by Stripe —
              we never see or store your full card number. We do keep a
              record of the order amount, currency, and Stripe&apos;s
              reference for that payment.
            </li>
            <li>
              <strong>Browsing data:</strong> your cart, colour selections,
              and any tees you&apos;ve added to Compare are stored locally
              in your browser (via <code>localStorage</code>). None of this
              is sent to us or any third party until you check out.
            </li>
            <li>
              <strong>Technical data:</strong> IP address, browser type, and
              basic usage data, collected automatically for security and to
              understand how the site is used (see Cookies, below).
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How we use your data</h2>
          <ul>
            <li>To process and fulfil your order, and communicate with you about it.</li>
            <li>To handle returns, refunds, and customer service queries.</li>
            <li>To meet our legal obligations (e.g. tax and accounting records).</li>
            <li>To detect and prevent fraud.</li>
            <li>
              To send you marketing about new tees or offers, only if
              you&apos;ve opted in, and you can unsubscribe at any time.
            </li>
            <li>To improve the site (aggregated, non-identifying analysis of orders and traffic).</li>
          </ul>
        </section>

        <section>
          <h2>4. Legal basis for processing (UK GDPR)</h2>
          <p>
            We process your data under the following legal bases: performance
            of a contract (fulfilling your order), legal obligation (tax and
            accounting records), legitimate interests (fraud prevention,
            improving our service), and consent (marketing emails, which you
            can withdraw at any time).
          </p>
        </section>

        <section>
          <h2>5. Cookies &amp; local storage</h2>
          <p>
            We use your browser&apos;s local storage to remember your cart
            and comparison list between visits. This stays on your device
            and isn&apos;t something we can read. If we add analytics or
            marketing cookies in future, we&apos;ll update this policy and
            ask for consent where required by law.
          </p>
        </section>

        <section>
          <h2>6. Who we share your data with</h2>
          <ul>
            <li>
              <strong>Stripe</strong>, our payment processor, to take
              payment securely.
            </li>
            <li>
              <strong>Delivery couriers</strong> [name your courier(s)], to
              deliver your order.
            </li>
            <li>
              The individual <strong>manufacturers</strong> of the tee(s)
              you order, where fulfilment requires it (e.g. dropshipping or
              warranty claims). We only share the details needed to fulfil
              that order.
            </li>
            <li>
              Professional advisers and authorities, where required by law.
            </li>
          </ul>
          <p>We never sell your personal data.</p>
        </section>

        <section>
          <h2>7. International transfers</h2>
          <p>
            Some of our service providers (including Stripe) may process
            data outside the UK/EEA. Where they do, we rely on their own
            appropriate safeguards (such as Standard Contractual Clauses).
          </p>
        </section>

        <section>
          <h2>8. How long we keep your data</h2>
          <p>
            We keep order and transaction records for as long as required by
            UK tax law (currently 6 years), and account/marketing data for
            as long as your account is active or until you ask us to delete
            it, whichever is sooner.
          </p>
        </section>

        <section>
          <h2>9. Your rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Ask us to correct inaccurate data.</li>
            <li>Ask us to delete your data (subject to legal retention requirements).</li>
            <li>Restrict or object to certain processing.</li>
            <li>Receive your data in a portable format.</li>
            <li>Withdraw consent to marketing at any time.</li>
            <li>
              Complain to the UK Information Commissioner&apos;s Office
              (ICO) at ico.org.uk if you think we&apos;ve mishandled your
              data.
            </li>
          </ul>
          <p>To exercise any of these, email [privacy@kickingtee.com].</p>
        </section>

        <section>
          <h2>10. Security</h2>
          <p>
            We use industry-standard measures (including HTTPS and a PCI-
            compliant payment processor) to protect your data. No system is
            100% secure, but we take reasonable steps to protect what we
            hold.
          </p>
        </section>

        <section>
          <h2>11. Children</h2>
          <p>
            KickingTee.com isn&apos;t intended for children under 16, and we
            don&apos;t knowingly collect data from them.
          </p>
        </section>

        <section>
          <h2>12. Changes to this policy</h2>
          <p>
            We may update this policy from time to time; the current version
            will always be posted on this page.
          </p>
        </section>

        <section>
          <h2>13. Contact us</h2>
          <p>
            [Company Legal Name], [Registered Address]. Email:
            [privacy@kickingtee.com].
          </p>
        </section>
      </div>
    </div>
  );
}
