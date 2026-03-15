/**
 * Central SEO config and helpers for metadata, canonical URLs, and structured data.
 * Use SITE_URL in production; Next.js uses request host in dev.
 */

export const SITE_NAME = "ComfinServ";
export const SITE_DESCRIPTION =
  "Getting your business started with simple, swift and reasonably priced legal services. Company registration, GST, taxation, trademark, ROC returns & advisory in India.";
export const SITE_KEYWORDS = [
  "business registration India",
  "company registration",
  "GST registration",
  "tax filing",
  "trademark registration",
  "ROC returns",
  "ComfinServ",
  "financial services",
];

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
