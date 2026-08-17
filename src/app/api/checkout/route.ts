import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getTeeBySlug, isPurchasable } from "@/lib/products";

interface CheckoutLine {
  slug: string;
  color: string;
  qty: number;
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Set STRIPE_SECRET_KEY in your environment to enable checkout.",
      },
      { status: 503 }
    );
  }

  let lines: CheckoutLine[];
  try {
    const body = await req.json();
    lines = body.lines;
    if (!Array.isArray(lines) || lines.length === 0) {
      throw new Error("empty cart");
    }
  } catch {
    return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const line of lines) {
    const tee = getTeeBySlug(line.slug);
    if (!tee || !isPurchasable(tee)) {
      return NextResponse.json(
        { error: `${line.slug} is not available for purchase.` },
        { status: 400 }
      );
    }
    const qty = Math.max(1, Math.min(20, Math.floor(line.qty) || 1));
    line_items.push({
      quantity: qty,
      price_data: {
        currency: "gbp",
        unit_amount: Math.round(tee.priceGBP! * 100),
        product_data: {
          name: `${tee.brand} ${tee.model}${line.color ? ` — ${line.color}` : ""}`,
          description: tee.category ?? undefined,
          metadata: { slug: tee.slug, color: line.color ?? "" },
        },
      },
    });
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: { allowed_countries: ["GB", "IE", "FR", "US", "AU", "NZ", "ZA"] },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
