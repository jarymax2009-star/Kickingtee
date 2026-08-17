import { DatabaseSync, type StatementSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

/**
 * Local SQLite file via Node's built-in (experimental) `node:sqlite`.
 * Good enough for a single-server deployment. If you deploy to a
 * serverless/multi-instance platform (Vercel, etc.) the filesystem isn't
 * persistent between invocations — swap this for a hosted DB (Turso/
 * libSQL, Postgres, Supabase...) before relying on it in production.
 */

const DB_PATH = path.join(process.cwd(), "data", "orders.db");

let db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (db) return db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      stripe_session_id TEXT UNIQUE NOT NULL,
      customer_email TEXT,
      customer_name TEXT,
      amount_total INTEGER NOT NULL,
      currency TEXT NOT NULL,
      shipping_address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL REFERENCES orders(id),
      slug TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      color TEXT,
      unit_amount INTEGER NOT NULL,
      quantity INTEGER NOT NULL
    );
  `);
  return db;
}

export interface NewOrderItem {
  slug: string;
  brand: string;
  model: string;
  color: string | null;
  unitAmount: number;
  quantity: number;
}

export interface NewOrder {
  id: string;
  stripeSessionId: string;
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number;
  currency: string;
  shippingAddress: string | null;
  items: NewOrderItem[];
}

/** Idempotent: a Stripe webhook can be retried/redelivered, so a duplicate
 * session id is silently ignored rather than inserted twice. */
export function insertOrder(order: NewOrder): { inserted: boolean } {
  const database = getDb();

  const insertOrderStmt: StatementSync = database.prepare(`
    INSERT OR IGNORE INTO orders
      (id, stripe_session_id, customer_email, customer_name, amount_total, currency, shipping_address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = insertOrderStmt.run(
    order.id,
    order.stripeSessionId,
    order.customerEmail,
    order.customerName,
    order.amountTotal,
    order.currency,
    order.shippingAddress
  );

  if (Number(result.changes) === 0) return { inserted: false };

  const insertItemStmt: StatementSync = database.prepare(`
    INSERT INTO order_items (order_id, slug, brand, model, color, unit_amount, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const item of order.items) {
    insertItemStmt.run(
      order.id,
      item.slug,
      item.brand,
      item.model,
      item.color,
      item.unitAmount,
      item.quantity
    );
  }

  return { inserted: true };
}

export interface OrderItemRow {
  id: number;
  order_id: string;
  slug: string;
  brand: string;
  model: string;
  color: string | null;
  unit_amount: number;
  quantity: number;
}

export interface OrderRow {
  id: string;
  stripe_session_id: string;
  customer_email: string | null;
  customer_name: string | null;
  amount_total: number;
  currency: string;
  shipping_address: string | null;
  created_at: string;
  items: OrderItemRow[];
}

export function listOrders(limit = 100): OrderRow[] {
  const database = getDb();
  const orders = database
    .prepare(`SELECT * FROM orders ORDER BY created_at DESC LIMIT ?`)
    .all(limit) as unknown as Omit<OrderRow, "items">[];
  const itemStmt = database.prepare(`SELECT * FROM order_items WHERE order_id = ?`);
  return orders.map((o) => ({
    ...o,
    items: itemStmt.all(o.id) as unknown as OrderItemRow[],
  }));
}

export interface TopTee {
  slug: string;
  brand: string;
  model: string;
  totalQuantity: number;
  orderCount: number;
}

export function topTees(limit = 10): TopTee[] {
  const database = getDb();
  return database
    .prepare(
      `SELECT slug, brand, model, SUM(quantity) as totalQuantity, COUNT(DISTINCT order_id) as orderCount
       FROM order_items
       GROUP BY slug
       ORDER BY totalQuantity DESC
       LIMIT ?`
    )
    .all(limit) as unknown as TopTee[];
}

export function orderStats(): { totalOrders: number; totalRevenue: number } {
  const database = getDb();
  const row = database
    .prepare(`SELECT COUNT(*) as totalOrders, COALESCE(SUM(amount_total), 0) as totalRevenue FROM orders`)
    .get() as { totalOrders: number; totalRevenue: number };
  return row;
}
