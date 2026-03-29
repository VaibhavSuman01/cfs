/**
 * Central SEO config and helpers for metadata, canonical URLs, and structured data.
 * Use SITE_URL in production; Next.js uses request host in dev.
 *
 * Note: Google largely ignores meta keywords for ranking; they still help some crawlers
 * and internal consistency. Prefer unique phrases over repetition (keyword stuffing hurts).
 */

import type { Metadata } from "next";

export const SITE_NAME = "Com Financial Services";

/** Short names and spellings used in search; also surfaced as Organization `alternateName` in JSON-LD. */
export const SITE_ALTERNATE_NAMES = ["CFS", "cfs", "Com Fin Serv"] as const;

export const SITE_DESCRIPTION =
  "Com Financial Services (CFS) – company registration, GST registration & GST filing, income tax / ITR, TDS, trademark, ISO, FSSAI, MSME Udyam, and ROC / MCA compliance across India. Online filings with expert support for startups and SMEs.";
export const SITE_KEYWORDS: string[] = [
  "Com Financial Services",
  ...SITE_ALTERNATE_NAMES,
  "business registration India",
  "company registration India",
  "private limited company registration",
  "one person company registration",
  "OPC registration India",
  "LLP registration",
  "partnership firm registration",
  "sole proprietorship registration",
  "Section 8 company registration",
  "Nidhi company registration",
  "producer company registration",
  "NGO registration India",
  "GST registration online",
  "GST return filing",
  "GSTR-1 GSTR-3B filing",
  "income tax return filing",
  "ITR filing India",
  "TDS return filing",
  "corporate tax filing India",
  "payroll tax compliance",
  "EPFO ESIC filing",
  "tax planning India",
  "trademark registration India",
  "copyright registration India",
  "ISO 9001 certification India",
  "ISO 14001 certification",
  "ROC annual filing",
  "MCA compliance",
  "board resolution company",
  "director DIN appointment",
  "share transfer private limited",
  "digital signature certificate DSC",
  "PAN card apply online",
  "TAN registration",
  "MSME Udyam registration",
  "Startup India registration",
  "FSSAI food license",
  "IEC import export code",
  "project report for bank loan",
  "CMA report",
  "DSCR report",
  "bank reconciliation services",
  "business advisory India",
  "legal compliance advisory",
  "startup mentoring India",
  "fund raising assistance",
  "company secretary services online",
  "free tax calculator India",
  "GST calculator",
  "income tax calculator",
  "financial services India",
  "CA services online India",
  "online legal services India",
];

/** Subset for schema.org `knowsAbout` (keep JSON-LD focused; +3 for brand alternates). */
export const SEO_SCHEMA_TOPICS = SITE_KEYWORDS.slice(0, 31);

/** Base URL for canonical and OG. Set in env or default for dev. */
export function getBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (typeof process.env.VERCEL_URL === "string") {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://comfinserv.com";
}

export function absoluteUrl(path: string): string {
  const base = getBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export type BuildPageMetadataInput = {
  path: string;
  title: string;
  description: string;
  /** Omit to inherit root `keywords` from the root layout merge. */
  keywords?: string[];
};

/** Consistent per-page metadata: canonical, Open Graph, Twitter, hreflang-style alternates. */
export function buildPageMetadata({
  path,
  title,
  description,
  keywords,
}: BuildPageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      images: [
        {
          url: absoluteUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: `${title} – ${SITE_NAME}, India`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [absoluteUrl("/og-image.png")],
    },
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
        en: canonical,
      },
    },
  };
}
