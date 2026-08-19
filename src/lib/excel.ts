import ExcelJS from "exceljs";
import path from "node:path";
import fs from "node:fs";

/**
 * A standalone .xlsx ledger of every order line item, kept in sync with
 * the SQLite database (src/lib/db.ts) but living as a real Excel file on
 * disk — outside the web app itself — so it can be opened directly in
 * Excel, or dropped into a synced folder (OneDrive/Dropbox/Google Drive
 * desktop) to make it available elsewhere automatically.
 *
 * One row per (tee, colour) line item, not per order, so every row
 * answers "which tee and colour was this?" on its own — multi-item
 * orders share the same Order ID across their rows.
 */

const EXCEL_PATH = path.join(process.cwd(), "data", "orders.xlsx");
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

async function loadWorkbook(): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  if (fs.existsSync(EXCEL_PATH)) {
    await workbook.xlsx.readFile(EXCEL_PATH);
  }
  let sheet = workbook.getWorksheet(SHEET_NAME);
  if (!sheet) {
    sheet = workbook.addWorksheet(SHEET_NAME);
  }
  if (sheet.rowCount === 0) {
    const headerRow = sheet.addRow(HEADERS);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0B1F3A" },
      };
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
  }
  return workbook;
}

export interface ExcelOrderItem {
  orderDate: string;
  orderId: string;
  customerName: string | null;
  customerEmail: string | null;
  brand: string;
  model: string;
  color: string | null;
  quantity: number;
  unitAmount: number;
  currency: string;
  shippingAddress: string | null;
}

/** Appends one row per line item and saves. Safe to call even if no
 * order has ever been recorded yet — creates the file with headers. */
export async function appendOrderRowsToExcel(items: ExcelOrderItem[]): Promise<void> {
  fs.mkdirSync(path.dirname(EXCEL_PATH), { recursive: true });
  const workbook = await loadWorkbook();
  const sheet = workbook.getWorksheet(SHEET_NAME)!;

  for (const item of items) {
    const row = sheet.addRow([
      item.orderDate,
      item.orderId,
      item.customerName ?? "",
      item.customerEmail ?? "",
      item.brand,
      item.model,
      item.color ?? "",
      item.quantity,
      item.unitAmount / 100,
      (item.unitAmount * item.quantity) / 100,
      item.currency.toUpperCase(),
      item.shippingAddress ?? "",
    ]);
    row.getCell(9).numFmt = "#,##0.00";
    row.getCell(10).numFmt = "#,##0.00";
  }

  await workbook.xlsx.writeFile(EXCEL_PATH);
}

/** Returns the current workbook as a buffer for download — creates an
 * (empty, headers-only) file first if no order has landed yet. */
export async function getOrdersWorkbookBuffer(): Promise<Buffer> {
  fs.mkdirSync(path.dirname(EXCEL_PATH), { recursive: true });
  const workbook = await loadWorkbook();
  if (!fs.existsSync(EXCEL_PATH)) {
    await workbook.xlsx.writeFile(EXCEL_PATH);
  }
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
