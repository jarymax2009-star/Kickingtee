import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";

const title = "Privacy Policy";
const description = "How KickingTee.com handles your data. Short version: we collect almost nothing.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title, description, url: "/privacy", images: ["/opengraph-image"] },
  twitter: { title, description },
};

const linkClass = "text-brand-blue underline underline-offset-2 hover:no-underline";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-brand-navy">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-brand-grey">Last updated: 29 October 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-brand-navy/85 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-brand-navy [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p+p]:mt-2">
        <section>
          <h2>1. Who we are</h2>
          <p>
            KickingTee.com is run by Max Jary as a sole trader in England,
            and is the data controller for this site. Contact:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a>.
          </p>
        </section>

        <section>
          <h2>2. The short version</h2>
          <p>
            You don&apos;t need an account to use this site, we don&apos;t
            sell anything, and we don&apos;t use advertising or tracking
            cookies.
          </p>
        </section>

        <section>
          <h2>3. What we collect</h2>
          <ul>
            <li>
              <strong>Your comparison list:</strong> the tees you add to
              Compare are saved in your own browser (local storage) so they
              are still there next time. This never leaves your device and we
              can&apos;t see it. You can clear it at any time by removing the
              tees or clearing your browser data.
            </li>
            <li>
              <strong>Server logs:</strong> like any website, our hosting
              provider (Vercel) automatically processes technical data such
              as your IP address and browser type to deliver pages and keep
              the site secure. We use this only for security and to fix
              problems, under our legitimate interest in running a safe
              website.
            </li>
            <li>
              <strong>Emails you send us:</strong> if you email us, we keep
              your message and email address so we can reply. We delete it
              when it&apos;s no longer needed.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Links to sellers</h2>
          <p>
            When you click through to a manufacturer or retailer, their own
            privacy policy applies from that point. We don&apos;t pass them
            any of your personal data.
          </p>
        </section>

        <section>
          <h2>5. Sharing and transfers</h2>
          <p>
            We never sell your data. Our hosting provider may process server
            logs outside the UK; where it does, it relies on recognised legal
            safeguards such as the UK International Data Transfer Addendum.
          </p>
        </section>

        <section>
          <h2>6. Your rights</h2>
          <p>
            Under UK data protection law you can ask to see, correct or
            delete any personal data we hold about you, or object to how we
            use it. Email us to do this. If you&apos;re unhappy with how we
            handle your data, you can complain to the Information
            Commissioner&apos;s Office at ico.org.uk.
          </p>
        </section>

        <section>
          <h2>7. Changes</h2>
          <p>
            If we add analytics, a newsletter, affiliate links or a shop in
            future, we&apos;ll update this policy first and ask for your
            consent where the law requires it.
          </p>
        </section>
      </div>
    </div>
  );
}
