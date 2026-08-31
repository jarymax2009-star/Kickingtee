import { NextResponse } from "next/server";
import { buildOrdersWorkbookBuffer } from "@/lib/excel";

export const runtime = "nodejs";

/** Protected by the same Basic Auth as the rest of /admin (see src/proxy.ts). */
export async function GET() {
  const buffer = await buildOrdersWorkbookBuffer();
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="kickingtee-orders-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
