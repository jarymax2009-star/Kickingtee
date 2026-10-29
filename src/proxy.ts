import { NextRequest, NextResponse } from "next/server";

const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";
const SHOP_ONLY_PATHS = ["/cart", "/checkout", "/returns", "/api/checkout"];

/**
 * 1. Comparison-only mode: while checkout is off, the cart, checkout,
 *    returns page and checkout API are switched off (pages redirect to
 *    /shop, the API returns 404).
 * 2. Basic Auth gate for /admin/*. Runs on the Edge runtime, so this
 *    intentionally avoids Node-only APIs (Buffer) in favour of atob().
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (SHOP_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (CHECKOUT_ENABLED) return NextResponse.next();
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Checkout is not available." }, { status: 404 });
    }
    return NextResponse.redirect(new URL("/shop", req.url));
  }

  const user = process.env.ADMIN_BASIC_AUTH_USER;
  const pass = process.env.ADMIN_BASIC_AUTH_PASS;

  if (!user || !pass) {
    return new NextResponse(
      "Admin area not configured. Set ADMIN_BASIC_AUTH_USER and ADMIN_BASIC_AUTH_PASS.",
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const encoded = authHeader.slice(6);
    try {
      const decoded = atob(encoded);
      const sepIndex = decoded.indexOf(":");
      const providedUser = decoded.slice(0, sepIndex);
      const providedPass = decoded.slice(sepIndex + 1);
      if (providedUser === user && providedPass === pass) {
        return NextResponse.next();
      }
    } catch {
      // fall through to 401
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="KickingTee Admin"' },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cart",
    "/checkout/:path*",
    "/returns",
    "/api/checkout",
  ],
};
