import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestaqueSlot } from "@/components/destaque";
import { SignupForm } from "@/components/signup-form";
import { TemplateGrid } from "@/components/template-card";
import { categoryBySlug } from "@/lib/catalog";
import { byNewest } from "@/lib/filter";
import { pageMetadata } from "@/lib/meta";
import { getDestaque, listPublished } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) return pageMetadata("Categoria", "Templates n8n por categoria.", `/categoria/${slug}`);
  const title = `Templates n8n de ${category.name}`;
  return pageMetadata(title, category.description, `/categoria/${category.slug}`);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();
  const [templates, sponsor] = await Promise.all([
    listPublished(),
    getDestaque(category.slug),
  ]);
  const matches = byNewest(templates.filter((template) => template.category === category.slug));

  return (
    <main id="conteudo" className="mx-auto max-w-5xl px-4 py-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal">Categoria</p>
      <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">Templates n8n de {category.name}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{category.description}</p>
      <div className="mt-5">
        <DestaqueSlot sponsor={sponsor} />
        <TemplateGrid templates={matches} />
      </div>
      <SignupForm />
    </main>
  );
}
