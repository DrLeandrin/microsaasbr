import { Fraunces, Outfit } from "next/font/google";
import type { Metadata } from "next";
import { connection } from "next/server";
import { PageviewBeacon } from "@/components/pageview-beacon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SponsorBar } from "@/components/sponsor-bar";
import { DISCLAIMER, SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/config";
import { getWeeklySponsor } from "@/lib/queries";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} — automações para negócios brasileiros`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const sponsor = await getWeeklySponsor();
  const bar = sponsor
    ? { href: `/go/${sponsor.slug}`, label: `${sponsor.barText} · ${sponsor.name}` }
    : { href: "/patrocinar", label: "Anuncie aqui" };

  return (
    <html lang="pt-BR" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-card focus:px-3 focus:py-2">
          Ir para o conteúdo
        </a>
        <div className="sticky top-0 z-30">
          <SponsorBar href={bar.href} label={bar.label} />
          <SiteHeader />
        </div>
        {children}
        <SiteFooter disclaimer={DISCLAIMER} />
        <PageviewBeacon />
      </body>
    </html>
  );
}
