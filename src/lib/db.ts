import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/schema";

export type Database = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
  db?: Database;
};

export class DatabaseUnavailable extends Error {
  constructor() {
    super("Banco não configurado.");
    this.name = "DatabaseUnavailable";
  }
}

export function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

export function getDb() {
  const url = databaseUrl();
  if (!url) return null;
  if (!globalForDb.db) {
    const local = /localhost|127\.0\.0\.1/.test(url);
    const sql = postgres(url, {
      max: 1,
      // Neon pooler (PgBouncer, transaction mode) rejects prepared statements.
      prepare: false,
      ssl: local ? false : "require",
      idle_timeout: 20,
      connect_timeout: 10,
    });
    globalForDb.sql = sql;
    globalForDb.db = drizzle(sql, { schema });
  }
  return globalForDb.db;
}

export function requireDb() {
  const db = getDb();
  if (!db) throw new DatabaseUnavailable();
  return db;
}

export async function closeDb() {
  await globalForDb.sql?.end({ timeout: 5 });
  globalForDb.sql = undefined;
  globalForDb.db = undefined;
}
