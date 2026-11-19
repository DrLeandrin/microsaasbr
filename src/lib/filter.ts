import {
  categoryName,
  difficultyName,
  resolveCategory,
  resolveDifficulty,
  resolveIntegration,
} from "@/lib/catalog";
import { fold } from "@/lib/slug";
import type { IntegrationRef } from "@/lib/validators";

export type TemplateView = {
  id: number;
  slug: string;
  title: string;
  description: string;
  explanation: string | null;
  integrations: IntegrationRef[];
  category: string;
  difficulty: string | null;
  difficultyNote: string | null;
  authorName: string | null;
  authorUrl: string | null;
  sourceUrl: string | null;
  sourceName: string | null;
  sourceDate: string | null;
  licenseNote: string | null;
  nodeCount: number | null;
  jsonDownloadable: boolean;
  hasHostedJson: boolean;
  addedAt: string;
  popularity: number;
  views: number;
};

export type TemplateFilters = {
  q?: string;
  categoria?: string;
  integracao?: string;
  dificuldade?: string;
};

export function filterTemplates(items: TemplateView[], filters: TemplateFilters) {
  const q = fold(filters.q ?? "");
  const category = filters.categoria ? resolveCategory(filters.categoria)?.slug ?? filters.categoria : "";
  const integration = filters.integracao
    ? resolveIntegration(filters.integracao)?.slug ?? filters.integracao
    : "";
  const difficulty = filters.dificuldade ? resolveDifficulty(filters.dificuldade) ?? filters.dificuldade : "";

  return items.filter((item) => {
    if (category && item.category !== category) return false;
    if (integration && !item.integrations.some((ref) => ref.slug === integration)) return false;
    if (difficulty && item.difficulty !== difficulty) return false;
    if (!q) return true;
    const haystack = fold(
      [
        item.title,
        item.description,
        item.explanation ?? "",
        item.authorName ?? "",
        item.sourceName ?? "",
        categoryName(item.category),
        difficultyName(item.difficulty) ?? "",
        ...item.integrations.map((ref) => ref.name),
      ].join(" "),
    );
    return haystack.includes(q);
  });
}

export function byNewest(items: TemplateView[]) {
  return [...items].sort(
    (a, b) => (b.sourceDate || b.addedAt).localeCompare(a.sourceDate || a.addedAt) || b.id - a.id,
  );
}

export function byPopular(items: TemplateView[]) {
  return [...items].sort(
    (a, b) => b.popularity + b.views - (a.popularity + a.views) || b.addedAt.localeCompare(a.addedAt),
  );
}

export function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
