import assert from "node:assert/strict";
import { test } from "node:test";
import { emailBlockReason } from "./email";
import { byNewest, filterTemplates, type TemplateView } from "./filter";
import { renderNewsletter } from "./newsletter";
import { itemsFromSeedBody } from "./seed-document";
import { parseTemplateWrite, parseWorkflowJson } from "./validators";

test("bloqueia e-mail de teste, example.com e descartável", () => {
  assert.match(emailBlockReason("test@empresa.com") ?? "", /teste/i);
  assert.match(emailBlockReason("pessoa@example.com") ?? "", /domínio/i);
  assert.match(emailBlockReason("a@mailinator.com") ?? "", /temporário/i);
  assert.equal(emailBlockReason("teste@oficina.com.br"), null);
});

test("newsletter tem no máximo 5 itens, escapa HTML e marca o descadastro", () => {
  const html = renderNewsletter({
    siteUrl: "https://n8nbrasil.test",
    issuedAt: new Date("2026-11-18T15:00:00Z"),
    sponsorLine: "Oficina <script>",
    picks: Array.from({ length: 6 }, (_, index) => ({
      title: index === 0 ? "<b>Pix</b>" : `Template ${index}`,
      description: "Cobra no Pix",
      slug: `item-${index}`,
    })),
  });
  assert.equal(html.match(/\/t\//g)?.length, 5);
  assert.equal(html.includes("<b>Pix</b>"), false);
  assert.match(html, /Patrocinado por Oficina &lt;script&gt;/);
  assert.match(html, /href="\{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}"/);
});

test("mapeia o seed sem cortar campo e deixa pago fora da lista", () => {
  const items = itemsFromSeedBody({
    templates: [
      {
        title: "Cobrar Pix",
        slug: "cobrar-pix",
        description: "Gera cobrança Pix a partir da planilha.",
        explanation: "Explica o fluxo com mais calma.",
        integrations: ["Pix", "NF-e (XML)"],
        category: "Financeiro e Pix",
        difficulty: "Fácil",
        difficulty_note: "Fluxo curto.",
        author: "Ana",
        author_url: "https://example.org/ana",
        source_url: "https://n8n.io/workflows/1",
        json_downloadable: true,
        license: "MIT",
        source_date: "2026-01-02",
        node_count: 8,
        source: "n8n.io",
      },
    ],
    paid: [
      {
        title: "Pacote pago",
        description: "Um pacote que não entra na listagem.",
        category: "Marketing",
        integrations: ["Hotmart"],
        source_url: "https://n8n.io/workflows/2",
        price: "R$ 10",
        price_as_shown: "R$ 10",
        purchase_url: "https://example.org/comprar",
      },
    ],
  });
  assert.equal(items.length, 2);
  const free = parseTemplateWrite(items[0], 0);
  const paid = parseTemplateWrite(items[1], 1);
  assert.equal(free.ok && paid.ok, true);
  if (!free.ok || !paid.ok) return;
  assert.equal(free.value.authorName, "Ana");
  assert.equal(free.value.licenseNote, "MIT");
  assert.equal(free.value.sourceDate, "2026-01-02");
  assert.equal(free.value.nodeCount, 8);
  assert.equal(free.value.sourceName, "n8n.io");
  assert.deepEqual(free.value.integrations, [
    { slug: "pix", name: "Pix" },
    { slug: "nf-e-xml", name: "NF-e (XML)" },
  ]);
  assert.equal(free.value.published, true);
  assert.equal(paid.value.published, false);
  assert.equal(paid.value.listed, false);
  assert.equal(paid.value.price, "R$ 10");
  assert.equal(paid.value.purchaseUrl, "https://example.org/comprar");
});

test("filtra por integração e ordena pela data da fonte", () => {
  const items: TemplateView[] = [
    base({ slug: "a", sourceDate: "2026-01-01", integrations: [{ slug: "pix", name: "Pix" }] }),
    base({ slug: "b", sourceDate: "2026-08-01", integrations: [{ slug: "whatsapp", name: "WhatsApp" }] }),
  ];
  assert.deepEqual(
    filterTemplates(items, { integracao: "whatsapp" }).map((item) => item.slug),
    ["b"],
  );
  assert.equal(byNewest(items)[0]?.slug, "b");
});

test("rejeita JSON que não é um workflow", () => {
  assert.equal(parseWorkflowJson("[]").ok, false);
  assert.equal(parseWorkflowJson(JSON.stringify({ nodes: [] })).ok, true);
});

function base(overrides: Partial<TemplateView>): TemplateView {
  return {
    id: 1,
    slug: "a",
    title: "Titulo",
    description: "Descricao curta do fluxo.",
    explanation: null,
    integrations: [],
    category: "marketing",
    difficulty: "facil",
    difficultyNote: null,
    authorName: null,
    authorUrl: null,
    sourceUrl: "https://n8n.io/workflows/1",
    sourceName: "n8n.io",
    sourceDate: "2026-01-01",
    licenseNote: "MIT",
    nodeCount: 4,
    jsonDownloadable: true,
    hasHostedJson: false,
    addedAt: "2026-01-01",
    popularity: 0,
    views: 0,
    ...overrides,
  };
}
