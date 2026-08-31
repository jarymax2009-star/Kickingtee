import { createClient, type Client } from "@libsql/client";
import path from "node:path";
import fs from "node:fs";

/**
 * Order database via libSQL. Locally (no TURSO_DATABASE_URL set) this
 * reads/writes a plain SQLite file at data/orders.db, so `npm run dev` and
 * `npm run build` need no external service. In production, set
 * TURSO_DATABASE_URL + TURSO_DATABASE_AUTH_TOKEN (https://turso.tech) so
 * writes land in a real hosted database instead of a serverless
 * function's non-persistent local disk.
 */

const LOCAL_DB_PATH = path.join(process.cwd(), "data", "orders.db");

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

function getClient(): Client {
  if (client) return client;
  if (!process.env.TURSO_DATABASE_URL) {
    fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
  }
  client = createClient(
    process.env.TURSO_DATABASE_URL
      ? { url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_DATABASE_AUTH_TOKEN }
      : { url: `file:${LOCAL_DB_PATH}` }
  );
  return client;
}

async function ready(): Promise<Client> {
  const db = getClient();
  if (!schemaReady) {
    schemaReady = db.executeMultiple(`
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
  }
  await schemaReady;
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
export async function insertOrder(order: NewOrder): Promise<{ inserted: boolean }> {
  const db = await ready();

  const result = await db.execute({
    sql: `INSERT OR IGNORE INTO orders
      (id, stripe_session_id, customer_email, customer_name, amount_total, currency, shipping_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      order.id,
      order.stripeSessionId,
      order.customerEmail,
      order.customerName,
      order.amountTotal,
      order.currency,
      order.shippingAddress,
    ],
  });

  if (result.rowsAffected === 0) return { inserted: false };

  for (const item of order.items) {
    await db.execute({
      sql: `INSERT INTO order_items (order_id, slug, brand, model, color, unit_amount, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [order.id, item.slug, item.brand, item.model, item.color, item.unitAmount, item.quantity],
    });
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

export async function listOrders(limit = 100): Promise<OrderRow[]> {
  const db = await ready();
  const orders = await db.execute({
    sql: `SELECT * FROM orders ORDER BY created_at DESC LIMIT ?`,
    args: [limit],
  });
  const rows = orders.rows as unknown as Omit<OrderRow, "items">[];

  const withItems: OrderRow[] = [];
  for (const order of rows) {
    const items = await db.execute({
      sql: `SELECT * FROM order_items WHERE order_id = ?`,
      args: [order.id],
    });
    withItems.push({ ...order, items: items.rows as unknown as OrderItemRow[] });
  }
  return withItems;
}

/** Every order line item ever recorded, oldest first — one row per
 * (tee, colour) line, joined with its parent order. Used to build the
 * Excel export fresh from the database on every download. */
export interface ExportRow {
  order_id: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  brand: string;
  model: string;
  color: string | null;
  quantity: number;
  unit_amount: number;
  currency: string;
  shipping_address: string | null;
}

export async function listAllOrderItemsForExport(): Promise<ExportRow[]> {
  const db = await ready();
  const result = await db.execute(`
    SELECT
      o.id as order_id,
      o.created_at as created_at,
      o.customer_name as customer_name,
      o.customer_email as customer_email,
      oi.brand as brand,
      oi.model as model,
      oi.color as color,
      oi.quantity as quantity,
      oi.unit_amount as unit_amount,
      o.currency as currency,
      o.shipping_address as shipping_address
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    ORDER BY o.created_at ASC, oi.id ASC
  `);
  return result.rows as unknown as ExportRow[];
}

export interface TopTee {
  slug: string;
  brand: string;
  model: string;
  totalQuantity: number;
  orderCount: number;
}

export async function topTees(limit = 10): Promise<TopTee[]> {
  const db = await ready();
  const result = await db.execute({
    sql: `SELECT slug, brand, model, SUM(quantity) as totalQuantity, COUNT(DISTINCT order_id) as orderCount
       FROM order_items
       GROUP BY slug
       ORDER BY totalQuantity DESC
       LIMIT ?`,
    args: [limit],
  });
  return result.rows as unknown as TopTee[];
}

export async function orderStats(): Promise<{ totalOrders: number; totalRevenue: number }> {
  const db = await ready();
  const result = await db.execute(
    `SELECT COUNT(*) as totalOrders, COALESCE(SUM(amount_total), 0) as totalRevenue FROM orders`
  );
  return result.rows[0] as unknown as { totalOrders: number; totalRevenue: number };
}
