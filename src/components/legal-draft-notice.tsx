export default function LegalDraftNotice() {
  return (
    <div className="mb-10 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-bold">Draft — not legal advice</p>
      <p className="mt-1">
        This page is a starting-point draft generated for KickingTee.com. It
        is not legal advice and has not been reviewed by a solicitor. Have a
        qualified professional review it — and fill in the{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
          [bracketed placeholders]
        </code>{" "}
        with your real company details — before relying on it or taking
        real payments.
      </p>
    </div>
  );
}
