import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";
import { loadEnv } from "./load-env";

loadEnv();

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("Defina DATABASE_URL ou POSTGRES_URL.");
  process.exit(1);
}

const sql = postgres(url, {
  max: 1,
  prepare: false,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require",
});

async function main() {
  const file = resolve(process.cwd(), "drizzle/0001_init.sql");
  await sql.unsafe(readFileSync(file, "utf8"));
  await sql.end();
  console.log("Migração aplicada.");
}

main().catch(async (error) => {
  console.error(error);
  await sql.end().catch(() => undefined);
  process.exit(1);
});
