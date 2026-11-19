import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { closeDb } from "../src/lib/db";
import { itemsFromSeedBody } from "../src/lib/seed-document";
import { parseTemplateWrite } from "../src/lib/validators";
import { upsertTemplates } from "../src/lib/writes";
import { loadEnv } from "./load-env";

loadEnv();

const file = resolve(process.cwd(), "data/seed.json");
const document = JSON.parse(readFileSync(file, "utf8")) as {
  templates?: unknown[];
  paid?: unknown[];
  gaps?: unknown[];
  methodology?: unknown;
};
const items = itemsFromSeedBody(document);

if (items.length === 0) {
  console.log("Nenhum template em data/seed.json.");
  process.exit(0);
}

async function main() {
  const parsed = items.map((item, index) => parseTemplateWrite(item, index));
  const errors = parsed.flatMap((result) => (result.ok ? [] : [result.error]));
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }

  const values = parsed.flatMap((result) => (result.ok ? [result.value] : []));
  const saved = await upsertTemplates(values);
  const published = values.filter((item) => item.published && item.listed).length;
  console.log(
    `Seed: ${saved.length} linhas (${published} na listagem pública, ${values.length - published} fora dela).`,
  );
  if (Array.isArray(document.gaps)) console.log(`Lacunas preservadas no arquivo: ${document.gaps.length}.`);
  if (document.methodology) console.log("Metodologia preservada no arquivo.");
  await closeDb();
}

main().catch(async (error) => {
  console.error(error);
  await closeDb().catch(() => undefined);
  process.exit(1);
});
