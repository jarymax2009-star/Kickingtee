import type { Metadata } from "next";
import LegalDraftNotice from "@/components/legal-draft-notice";

const title = "Terms & Conditions";
const description = "Terms and conditions of sale for KickingTee.com.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title, description, url: "/terms", images: ["/opengraph-image"] },
  twitter: { title, description },
  // Draft content with [bracketed placeholders] instead of real company
  // details — keep it out of search results until it's finalised, then
  // remove this once real details are filled in.
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-brand-navy">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-brand-grey">
        Last updated: [insert date] · Draft version 1.0
      </p>

      <LegalDraftNotice />

      <div className="space-y-8 text-sm leading-relaxed text-brand-navy/85 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-brand-navy [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p+p]:mt-2">
        <section>
          <h2>1. Who we are</h2>
          <p>
            KickingTee.com (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
            &ldquo;our&rdquo;) is operated by [Company Legal Name], a
            company registered in England &amp; Wales under company number
            [Company Number], with registered office at [Registered
            Address]. Our VAT number (if applicable) is [VAT Number]. You
            can contact us at [support@kickingtee.com] or [phone number].
          </p>
          <p>
            These terms apply to every order placed through kickingtee.com
            and, together with our{" "}
            <a href="/privacy" className="text-brand-blue underline underline-offset-2 hover:no-underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/returns" className="text-brand-blue underline underline-offset-2 hover:no-underline">
              Returns &amp; Refunds Policy
            </a>
            , form the agreement between you and us.
          </p>
        </section>

        <section>
          <h2>2. Products, pricing and availability</h2>
          <p>
            We sell rugby kicking tees sourced from a range of third-party
            manufacturers. We aggregate specifications and pricing from
            manufacturer and retailer listings; where a figure is not
            publicly confirmed by the manufacturer, we label it as
            &ldquo;estimated&rdquo; on the product page. Colourway options
            shown are indicative and are not confirmed manufacturer SKUs
            unless stated otherwise — we will contact you if your chosen
            colour is unavailable before dispatch.
          </p>
          <p>
            All prices are shown in GBP (£) and include VAT where
            applicable, unless stated otherwise. We reserve the right to
            correct pricing errors before an order is dispatched; if we
            discover a pricing error after you&apos;ve paid, we will contact
            you with the option to reconfirm at the correct price or cancel
            for a full refund.
          </p>
        </section>

        <section>
          <h2>3. Orders and the contract between us</h2>
          <p>
            When you place an order, we will send you an order confirmation
            email. This confirms we&apos;ve received your order but does not
            mean we&apos;ve accepted it. A binding contract is formed when
            we dispatch your order (or confirm dispatch by email).
          </p>
          <p>
            We may decline or cancel an order at our discretion — for
            example if an item is unexpectedly out of stock, if we
            suspect fraud, or if a pricing or listing error is identified.
            If we cancel an order you have paid for, we will refund you in
            full.
          </p>
        </section>

        <section>
          <h2>4. Payment</h2>
          <p>
            Payment is taken securely via Stripe at the time of order. We do
            not store your full card details on our servers. Stripe&apos;s
            own terms and privacy policy also apply to your payment.
          </p>
        </section>

        <section>
          <h2>5. Delivery</h2>
          <p>
            We aim to dispatch orders within [X business days] of payment.
            Estimated delivery times are [X&ndash;Y business days] within
            the UK and [X&ndash;Y business days] for other destinations we
            ship to, though these are estimates, not guarantees. Delivery
            costs (if any) are shown at checkout before you pay.
          </p>
          <p>
            Risk in the goods passes to you on delivery. If a delivery is
            lost or arrives damaged, contact us at [support@kickingtee.com]
            and we&apos;ll sort it out.
          </p>
        </section>

        <section>
          <h2>6. Your right to cancel (change of mind)</h2>
          <p>
            If you&apos;re a consumer in the UK, the Consumer Contracts
            Regulations 2013 give you the right to cancel your order within
            14 days of receiving your goods, for any reason, without
            needing to give a reason. See our{" "}
            <a href="/returns" className="text-brand-blue underline underline-offset-2 hover:no-underline">
              Returns &amp; Refunds Policy
            </a>{" "}
            for exactly how to do this.
          </p>
        </section>

        <section>
          <h2>7. Faulty or misdescribed goods</h2>
          <p>
            Nothing in these terms affects your statutory rights under the
            Consumer Rights Act 2015. If a product is faulty, not as
            described, or not fit for purpose, you may be entitled to a
            repair, replacement, price reduction, or refund depending on how
            long you&apos;ve had it. See our{" "}
            <a href="/returns" className="text-brand-blue underline underline-offset-2 hover:no-underline">
              Returns &amp; Refunds Policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2>8. Our liability</h2>
          <p>
            We&apos;re responsible for foreseeable loss or damage caused by
            us. We&apos;re not liable for loss or damage that isn&apos;t
            foreseeable, for business losses if you&apos;re using a product
            for business purposes, or for anything outside our reasonable
            control. Nothing in these terms limits our liability for death
            or personal injury caused by our negligence, for fraud, or for
            anything else that can&apos;t legally be limited or excluded.
          </p>
        </section>

        <section>
          <h2>9. Intellectual property</h2>
          <p>
            All content on kickingtee.com — including our name, logo, spec
            comparisons, and independent testing ratings — belongs to us or
            our licensors. Manufacturer names, product names, and any
            associated trade marks belong to their respective owners; we use
            them for identification purposes only.
          </p>
        </section>

        <section>
          <h2>10. Governing law</h2>
          <p>
            These terms are governed by the laws of England and Wales. Any
            disputes will be subject to the exclusive jurisdiction of the
            courts of England and Wales, though if you live elsewhere in the
            UK, mandatory local consumer protections may also apply.
          </p>
        </section>

        <section>
          <h2>11. Changes to these terms</h2>
          <p>
            We may update these terms from time to time; the version that
            applies to your order is the one in force at the time you
            placed it. We&apos;ll post the current version on this page.
          </p>
        </section>

        <section>
          <h2>12. Contact us</h2>
          <p>
            Questions about these terms? Email [support@kickingtee.com].
          </p>
        </section>
      </div>
    </div>
  );
}
