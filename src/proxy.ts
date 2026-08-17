import { NextRequest, NextResponse } from "next/server";

/**
 * Basic Auth gate for /admin/*. Runs on the Edge runtime, so this
 * intentionally avoids Node-only APIs (Buffer) in favour of atob().
 */
export function proxy(req: NextRequest) {
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
  matcher: ["/admin/:path*"],
};
