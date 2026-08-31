import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { insertOrder } from "@/lib/db";
import { sendOrderNotificationEmail } from "@/lib/email";
import { getTeeBySlug } from "@/lib/products";

export const runtime = "nodejs";

function formatAddress(address: Stripe.Address | null | undefined, name?: string | null) {
  if (!address) return null;
  const lines = [
    name ?? undefined,
    address.line1 ?? undefined,
    address.line2 ?? undefined,
    [address.city, address.postal_code].filter(Boolean).join(" ") || undefined,
    address.state ?? undefined,
    address.country ?? undefined,
  ].filter(Boolean);
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.error("[stripe-webhook] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, skipped: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    // Delayed payment methods land here unpaid, then fire
    // checkout.session.async_payment_succeeded once cleared — not yet
    // handled, so skip for now rather than record an unpaid order.
    return NextResponse.json({ received: true, skipped: "not_paid_yet" });
  }

  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
      limit: 100,
    });

    const items = lineItems.data.map((li) => {
      const product = li.price?.product as Stripe.Product | undefined;
      const slug = product?.metadata?.slug ?? "";
      const tee = slug ? getTeeBySlug(slug) : undefined;
      const color = product?.metadata?.color || null;
      return {
        slug,
        brand: tee?.brand ?? product?.name?.split(" ")[0] ?? "Unknown",
        model: tee?.model ?? product?.name ?? "Unknown item",
        color,
        unitAmount: li.price?.unit_amount ?? 0,
        quantity: li.quantity ?? 1,
      };
    });

    const shippingDetails = session.collected_information?.shipping_details;
    const shippingAddress = formatAddress(
      shippingDetails?.address ?? session.customer_details?.address,
      shippingDetails?.name ?? session.customer_details?.name
    );

    const { inserted } = await insertOrder({
      id: session.id,
      stripeSessionId: session.id,
      customerEmail: session.customer_details?.email ?? null,
      customerName: session.customer_details?.name ?? null,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? "gbp",
      shippingAddress,
      items,
    });

    if (inserted) {
      const customerEmail = session.customer_details?.email ?? null;
      const customerName = session.customer_details?.name ?? null;
      const currency = session.currency ?? "gbp";

      await sendOrderNotificationEmail({
        orderId: session.id,
        stripeSessionId: session.id,
        customerEmail,
        customerName,
        amountTotal: session.amount_total ?? 0,
        currency,
        items,
        shippingAddress,
      });
    }

    return NextResponse.json({ received: true, inserted });
  } catch (err) {
    console.error("[stripe-webhook] Failed to process checkout.session.completed", err);
    // Return 500 so Stripe retries delivery.
    return NextResponse.json({ error: "Failed to process webhook." }, { status: 500 });
  }
}
