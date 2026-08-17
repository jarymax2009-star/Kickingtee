import type { Metadata } from "next";
import LegalDraftNotice from "@/components/legal-draft-notice";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "How to return an item and how refunds work at KickingTee.com.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-brand-navy">
        Returns &amp; Refunds Policy
      </h1>
      <p className="mt-2 text-sm text-brand-grey">
        Last updated: [insert date] · Draft version 1.0
      </p>

      <LegalDraftNotice />

      <div className="space-y-8 text-sm leading-relaxed text-brand-navy/85 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-brand-navy [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_p+p]:mt-2">
        <section>
          <h2>1. Changed your mind? (14-day cancellation right)</h2>
          <p>
            As a UK consumer, you have the right to cancel your order within
            14 days of receiving it, without giving a reason, under the
            Consumer Contracts Regulations 2013. You then have a further 14
            days to send the item back to us.
          </p>
          <p>To cancel and return an item:</p>
          <ol>
            <li>
              Email [returns@kickingtee.com] with your order number and
              which item(s) you&apos;re returning, within 14 days of
              receiving your order.
            </li>
            <li>
              We&apos;ll confirm the return and give you the return
              address.
            </li>
            <li>
              Send the item back, unused and in its original packaging
              where possible, within 14 days of telling us.
            </li>
          </ol>
        </section>

        <section>
          <h2>2. Who pays return postage</h2>
          <p>
            For a change-of-mind return, you&apos;re responsible for the
            cost of returning the item unless we sent you the wrong item or
            it arrived faulty or damaged, in which case we&apos;ll cover
            return postage — contact us first and we&apos;ll advise the
            best way to send it back.
          </p>
        </section>

        <section>
          <h2>3. Refunds</h2>
          <p>
            Once we&apos;ve received and checked your returned item, we&apos;ll
            refund you to your original payment method within 14 days. If
            you paid for standard delivery, we&apos;ll refund that too (for
            a full-order return); we don&apos;t refund upgraded/express
            delivery costs beyond the standard rate.
          </p>
        </section>

        <section>
          <h2>4. Faulty, damaged, or wrong items</h2>
          <p>
            If your tee arrives faulty, damaged, or isn&apos;t what you
            ordered, you&apos;re covered separately by your statutory rights
            under the Consumer Rights Act 2015 — this is broader than the
            change-of-mind window above. Depending on how long you&apos;ve
            had the item, you may be entitled to a repair, replacement, or
            refund. Email [returns@kickingtee.com] with your order number
            and a photo of the issue and we&apos;ll sort it out — this
            doesn&apos;t affect your right to return an unwanted item under
            Section 1.
          </p>
        </section>

        <section>
          <h2>5. Condition of returned items</h2>
          <p>
            Items should be returned unused, with any tags/packaging intact
            where reasonably possible, so we can resell or return them to
            the manufacturer. This doesn&apos;t affect your right to inspect
            an item as you reasonably would in a shop — we may make a
            deduction from your refund if the value has been reduced by
            handling beyond that.
          </p>
        </section>

        <section>
          <h2>6. How to start a return</h2>
          <p>
            Email [returns@kickingtee.com] with your order number, or reply
            to your order confirmation email. We aim to respond within [1–2
            business days].
          </p>
        </section>
      </div>
    </div>
  );
}
