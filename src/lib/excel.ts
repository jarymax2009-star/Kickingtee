import ExcelJS from "exceljs";
import { listAllOrderItemsForExport } from "./db";

/**
 * A standalone .xlsx export of every order line item, built fresh from the
 * database on every download rather than accumulated on local disk — a
 * serverless deployment's filesystem doesn't persist between invocations,
 * so the database (see src/lib/db.ts) is the single source of truth and
 * this is just a derived view of it.
 *
 * One row per (tee, colour) line item, not per order, so every row
 * answers "which tee and colour was this?" on its own — multi-item
 * orders share the same Order ID across their rows.
 */

const SHEET_NAME = "Orders";

const HEADERS = [
  "Order date (UTC)",
  "Order ID",
  "Customer name",
  "Customer email",
  "Brand",
  "Tee",
  "Colour",
  "Quantity",
  "Unit price",
  "Line total",
  "Currency",
  "Shipping address",
];

/** Builds the current orders workbook from the database and returns it as
 * a buffer for download. Headers-only if no order has landed yet. */
export async function buildOrdersWorkbookBuffer(): Promise<Buffer> {
  const rows = await listAllOrderItemsForExport();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(SHEET_NAME);

  const headerRow = sheet.addRow(HEADERS);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0B1F3A" } };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
  });
  sheet.columns = [
    { width: 20 },
    { width: 22 },
    { width: 20 },
    { width: 26 },
    { width: 16 },
    { width: 28 },
    { width: 14 },
    { width: 10 },
    { width: 12 },
    { width: 12 },
    { width: 10 },
    { width: 36 },
  ];
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  for (const item of rows) {
    const row = sheet.addRow([
      item.created_at,
      item.order_id,
      item.customer_name ?? "",
      item.customer_email ?? "",
      item.brand,
      item.model,
      item.color ?? "",
      item.quantity,
      item.unit_amount / 100,
      (item.unit_amount * item.quantity) / 100,
      item.currency.toUpperCase(),
      item.shipping_address ?? "",
    ]);
    row.getCell(9).numFmt = "#,##0.00";
    row.getCell(10).numFmt = "#,##0.00";
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
