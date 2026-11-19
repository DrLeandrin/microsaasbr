import { fold, humanizeSlug, slugify } from "@/lib/slug";

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Integration = {
  slug: string;
  name: string;
  description: string;
  aliases?: string[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "atendimento-whatsapp",
    name: "Atendimento/WhatsApp",
    description:
      "Fluxos de n8n para responder, triar e encaminhar conversa de WhatsApp.",
  },
  {
    slug: "vendas-crm",
    name: "Vendas e CRM",
    description:
      "Templates para registrar lead, mover negócio e avisar o time quando entra venda.",
  },
  {
    slug: "financeiro-pix",
    name: "Financeiro e Pix",
    description:
      "Automações de cobrança, Pix e conciliação com as ferramentas usadas no Brasil.",
  },
  {
    slug: "nota-fiscal",
    name: "Nota fiscal",
    description:
      "Fluxos para emitir, consultar e guardar nota fiscal sem copiar dado na mão.",
  },
  {
    slug: "e-commerce",
    name: "E-commerce",
    description:
      "Templates ligando loja, estoque, pedido e mensagem de quem vende online.",
  },
  {
    slug: "infoprodutos",
    name: "Infoprodutos",
    description:
      "Automações para Hotmart, Kiwify, Eduzz e o que acontece depois da compra.",
  },
  {
    slug: "marketing",
    name: "Marketing",
    description:
      "Fluxos de captura, nutrição e aviso para campanhas feitas no Brasil.",
  },
  {
    slug: "ia-agentes",
    name: "IA e agentes",
    description:
      "Templates que colocam um modelo de IA dentro de um fluxo com começo e fim.",
  },
  {
    slug: "produtividade",
    name: "Produtividade",
    description:
      "Planilha, e-mail e tarefa: automações que tiram trabalho repetido do dia.",
  },
];

export const INTEGRATIONS: Integration[] = [
  {
    slug: "whatsapp",
    name: "WhatsApp",
    description: "Templates de n8n que entram ou saem pelo WhatsApp.",
  },
  {
    slug: "evolution-api",
    name: "Evolution API",
    description: "Fluxos de WhatsApp usando a Evolution API.",
    aliases: ["evolution"],
  },
  {
    slug: "z-api",
    name: "Z-API",
    description: "Fluxos de WhatsApp usando a Z-API.",
    aliases: ["zapi"],
  },
  {
    slug: "whatsapp-cloud-api",
    name: "WhatsApp Cloud API",
    description: "Fluxos pelo WhatsApp oficial, na Cloud API.",
    aliases: ["whatsapp-cloud", "cloud-api"],
  },
  {
    slug: "pix",
    name: "Pix",
    description: "Cobrança e confirmação de Pix dentro do fluxo.",
  },
  {
    slug: "mercado-pago",
    name: "Mercado Pago",
    description: "Pagamento e Pix com Mercado Pago.",
  },
  {
    slug: "asaas",
    name: "Asaas",
    description: "Cobrança e Pix com Asaas.",
  },
  {
    slug: "efi",
    name: "Efi",
    description: "Cobrança e Pix com Efi.",
    aliases: ["gerencianet", "efi-bank"],
  },
  {
    slug: "nota-fiscal",
    name: "Nota fiscal",
    description: "Emissão e consulta de nota fiscal no n8n.",
  },
  {
    slug: "focus-nfe",
    name: "Focus NFe",
    description: "Nota fiscal pela Focus NFe.",
    aliases: ["focus"],
  },
  {
    slug: "enotas",
    name: "eNotas",
    description: "Nota fiscal pelo eNotas.",
  },
  {
    slug: "nfe-io",
    name: "NFE.io",
    description: "Nota fiscal pela NFE.io.",
    aliases: ["nfeio", "nfe-io"],
  },
  {
    slug: "bling",
    name: "Bling",
    description: "Pedidos e estoque no Bling.",
  },
  {
    slug: "tiny",
    name: "Tiny",
    description: "Pedidos e estoque na Tiny.",
  },
  {
    slug: "omie",
    name: "Omie",
    description: "Financeiro e ERP no Omie.",
  },
  {
    slug: "hotmart",
    name: "Hotmart",
    description: "Vendas e eventos da Hotmart.",
  },
  {
    slug: "kiwify",
    name: "Kiwify",
    description: "Vendas e eventos da Kiwify.",
  },
  {
    slug: "eduzz",
    name: "Eduzz",
    description: "Vendas e eventos da Eduzz.",
  },
  {
    slug: "mercado-livre",
    name: "Mercado Livre",
    description: "Pedidos e mensagens do Mercado Livre.",
    aliases: ["meli"],
  },
  {
    slug: "shopee",
    name: "Shopee",
    description: "Pedidos da Shopee.",
  },
  {
    slug: "nuvemshop",
    name: "Nuvemshop",
    description: "Loja na Nuvemshop.",
  },
  {
    slug: "rd-station",
    name: "RD Station",
    description: "Leads e eventos no RD Station.",
    aliases: ["rdstation"],
  },
  {
    slug: "google-sheets",
    name: "Google Sheets",
    description: "Planilha do Google como fila, cadastro ou relatório.",
    aliases: ["sheets", "planilhas-google"],
  },
  {
    slug: "openai",
    name: "OpenAI",
    description: "Chamada de modelo da OpenAI no meio do fluxo.",
  },
];

export const DIFFICULTIES = [
  { slug: "facil", name: "Fácil" },
  { slug: "medio", name: "Médio" },
  { slug: "avancado", name: "Avançado" },
] as const;

export type DifficultySlug = (typeof DIFFICULTIES)[number]["slug"];

const categoryByKey = new Map<string, Category>();
for (const category of CATEGORIES) {
  categoryByKey.set(category.slug, category);
  categoryByKey.set(slugify(category.name), category);
  categoryByKey.set(fold(category.name), category);
}

const integrationByKey = new Map<string, Integration>();
for (const integration of INTEGRATIONS) {
  integrationByKey.set(integration.slug, integration);
  integrationByKey.set(slugify(integration.name), integration);
  integrationByKey.set(fold(integration.name), integration);
  for (const alias of integration.aliases ?? []) {
    integrationByKey.set(slugify(alias), integration);
    integrationByKey.set(fold(alias), integration);
  }
}

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function integrationBySlug(slug: string) {
  return INTEGRATIONS.find((integration) => integration.slug === slug) ?? null;
}

export function resolveCategory(input: string) {
  const key = input.trim();
  if (!key) return null;
  return (
    categoryByKey.get(key) ??
    categoryByKey.get(slugify(key)) ??
    categoryByKey.get(fold(key)) ??
    null
  );
}

export function resolveIntegration(input: string) {
  const key = input.trim();
  if (!key) return null;
  return (
    integrationByKey.get(key) ??
    integrationByKey.get(slugify(key)) ??
    integrationByKey.get(fold(key)) ??
    null
  );
}

export function resolveDifficulty(input: string | null | undefined) {
  if (!input) return null;
  const key = slugify(input);
  if (key === "facil" || key === "faceis") return "facil" as const;
  if (key === "medio" || key === "media") return "medio" as const;
  if (key === "avancado" || key === "avancada" || key === "dificil") {
    return "avancado" as const;
  }
  return null;
}

export function categoryName(slug: string) {
  return categoryBySlug(slug)?.name ?? humanizeSlug(slug);
}

export function integrationName(slug: string) {
  return integrationBySlug(slug)?.name ?? humanizeSlug(slug);
}

export function difficultyName(slug: string | null | undefined) {
  return DIFFICULTIES.find((item) => item.slug === slug)?.name ?? null;
}
