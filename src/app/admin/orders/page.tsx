import type { Metadata } from "next";
import { listOrders, topTees, orderStats } from "@/lib/db";

// Orders change on every webhook delivery — must be read fresh per
// request, not baked in at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders: Admin",
  robots: { index: false, follow: false },
};

function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountMinor / 100);
}

export default async function AdminOrdersPage() {
  const [orders, top, stats] = await Promise.all([listOrders(100), topTees(10), orderStats()]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-navy">Orders</h1>
          <p className="mt-1 text-sm text-brand-grey">
            Internal view, recorded from Stripe webhook events as orders complete.
          </p>
        </div>
        <a
          href="/admin/orders/export"
          className="shrink-0 rounded-md bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-navy"
        >
          Download orders (.xlsx)
        </a>
      </div>
      <p className="mt-2 text-xs text-brand-grey">
        Every order also appends automatically to a standalone Excel
        workbook at <code className="rounded bg-brand-silver/50 px-1 py-0.5">data/orders.xlsx</code> on
        the server, one row per tee and colour ordered. Download it above,
        or point a synced folder (OneDrive/Dropbox/Google Drive desktop)
        at that file to keep a live copy off the server.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-silver p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-grey">Total orders</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{stats.totalOrders}</p>
        </div>
        <div className="rounded-xl border border-brand-silver p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-grey">Total revenue</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-navy">
            {formatMoney(stats.totalRevenue, "gbp")}
          </p>
        </div>
      </div>

      <h2 className="mt-10 mb-3 font-display text-lg font-bold text-brand-navy">
        Most-ordered tees
      </h2>
      {top.length === 0 ? (
        <p className="text-sm text-brand-grey">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-silver">
          <table className="w-full text-sm">
            <thead className="bg-brand-silver/40 text-left text-xs font-bold uppercase tracking-wide text-brand-grey">
              <tr>
                <th className="p-3">Tee</th>
                <th className="p-3 text-right">Units ordered</th>
                <th className="p-3 text-right">Orders</th>
              </tr>
            </thead>
            <tbody>
              {top.map((t) => (
                <tr key={t.slug} className="border-t border-brand-silver/70">
                  <td className="p-3 font-semibold text-brand-navy">
                    {t.brand} {t.model}
                  </td>
                  <td className="p-3 text-right">{t.totalQuantity}</td>
                  <td className="p-3 text-right">{t.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-10 mb-3 font-display text-lg font-bold text-brand-navy">
        Recent orders
      </h2>
      {orders.length === 0 ? (
        <p className="text-sm text-brand-grey">
          No orders yet. This fills in automatically once Stripe webhooks are
          configured and a real payment completes.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-brand-silver p-5 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display font-bold text-brand-navy">
                    {formatMoney(o.amount_total, o.currency)}
                  </p>
                  <p className="text-xs text-brand-grey">
                    {o.customer_name ?? "—"} · {o.customer_email ?? "no email"}
                  </p>
                </div>
                <p className="text-xs text-brand-grey">{o.created_at} UTC</p>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-brand-navy/80">
                {o.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.brand} {item.model}
                    {item.color ? ` (${item.color})` : ""}:{" "}
                    {formatMoney(item.unit_amount * item.quantity, o.currency)}
                  </li>
                ))}
              </ul>
              {o.shipping_address && (
                <p className="mt-3 whitespace-pre-line text-xs text-brand-grey">
                  Ship to: {o.shipping_address}
                </p>
              )}
              <p className="mt-2 text-[10px] text-brand-grey">
                Stripe session: {o.stripe_session_id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
