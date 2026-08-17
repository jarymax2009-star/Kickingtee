interface OrderEmailItem {
  brand: string;
  model: string;
  color: string | null;
  quantity: number;
  unitAmount: number;
}

interface OrderEmailPayload {
  orderId: string;
  stripeSessionId: string;
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number;
  currency: string;
  items: OrderEmailItem[];
  shippingAddress: string | null;
}

function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountMinor / 100);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Emails the site owner a summary of a new order via the Resend API.
 * No-ops (with a console warning) if RESEND_API_KEY / ORDER_NOTIFICATION_EMAIL
 * aren't set, so a missing email config never blocks order recording.
 */
export async function sendOrderNotificationEmail(
  order: OrderEmailPayload
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  const from = process.env.ORDER_NOTIFICATION_FROM ?? "KickingTee.com <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn(
      "[email] RESEND_API_KEY or ORDER_NOTIFICATION_EMAIL not set — skipping order notification email."
    );
    return { sent: false, reason: "not_configured" };
  }

  const itemRows = order.items
    .map(
      (i) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escapeHtml(i.brand)} ${escapeHtml(i.model)}${i.color ? ` (${escapeHtml(i.color)})` : ""}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${formatMoney(i.unitAmount * i.quantity, order.currency)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#0B1F3A;">
      <h2 style="margin-bottom:4px;">New order — ${formatMoney(order.amountTotal, order.currency)}</h2>
      <p style="color:#5B6770;font-size:13px;">
        Order ${escapeHtml(order.orderId)}<br/>Stripe session ${escapeHtml(order.stripeSessionId)}
      </p>
      <p><strong>Customer:</strong> ${escapeHtml(order.customerName ?? "—")} &lt;${escapeHtml(order.customerEmail ?? "no email given")}&gt;</p>
      ${
        order.shippingAddress
          ? `<p><strong>Shipping to:</strong><br/>${escapeHtml(order.shippingAddress).replace(/\n/g, "<br/>")}</p>`
          : ""
      }
      <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #0B1F3A;">Item</th>
            <th style="padding:6px 8px;border-bottom:2px solid #0B1F3A;">Qty</th>
            <th style="text-align:right;padding:6px 8px;border-bottom:2px solid #0B1F3A;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p style="margin-top:16px;font-weight:bold;">
        Order total: ${formatMoney(order.amountTotal, order.currency)}
      </p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `New KickingTee.com order — ${formatMoney(order.amountTotal, order.currency)}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("[email] Resend API error", res.status, await res.text());
      return { sent: false, reason: `resend_${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send order notification email", err);
    return { sent: false, reason: "fetch_error" };
  }
}
