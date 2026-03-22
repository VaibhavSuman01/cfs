/**
 * Central SEO config and helpers for metadata, canonical URLs, and structured data.
 * Use SITE_URL in production; Next.js uses request host in dev.
 *
 * Note: Google largely ignores meta keywords for ranking; they still help some crawlers
 * and internal consistency. Prefer unique phrases over repetition (keyword stuffing hurts).
 */

export const SITE_NAME = "COM Financial Services";
export const SITE_DESCRIPTION =
  "Company registration, GST, income tax, TDS, trademark & ROC filing in India. Simple, swift legal and compliance services for startups and SMEs.";
export const SITE_KEYWORDS: string[] = [
  "COM Financial Services",
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

/** Subset for schema.org `knowsAbout` (keep JSON-LD focused). */
export const SEO_SCHEMA_TOPICS = SITE_KEYWORDS.slice(0, 28);

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
