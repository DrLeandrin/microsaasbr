import Link from "next/link";
import type { SponsorCard } from "@/lib/queries";

export function DestaqueSlot({ sponsor }: { sponsor: SponsorCard | null }) {
  if (!sponsor) return null;
  return (
    <aside className="mb-4 rounded-2xl border border-clay/30 bg-clay-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-clay">Destaque</p>
      <Link href={`/go/${sponsor.slug}`} className="mt-1 block font-display text-2xl hover:text-clay">
        {sponsor.name}
      </Link>
      <p className="mt-1 text-sm text-ink-soft">{sponsor.barText}</p>
    </aside>
  );
}
