export type ServicePackages = {
  BASIC?: string;
  STANDARD?: string;
  PREMIUM?: string;
};

export type ServicePricing = {
  basePrice?: string; // current payment / card base price
  packages?: ServicePackages;
};

// Helper: normalize service keys to improve matching
function key(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

// Map built from frontend/service_prices.csv
const PRICING_RAW: Record<string, ServicePricing> = {
  "trademark search": { basePrice: "₹999", packages: { BASIC: "₹1,499" } },
  "trademark filing": { basePrice: "₹3,999", packages: { BASIC: "₹3,999" } },
  "trademark registration (for msme)": { basePrice: "₹6,999", packages: { BASIC: "₹12,999" } },
  "iso 9001:2015": { basePrice: "₹15,999" },
  "iso 14001:2015": { basePrice: "₹18,999" },
  "iso 45001:2018": { basePrice: "₹20,999" },
  "gst filing": { basePrice: "₹1,999", packages: { BASIC: "₹2,999", PREMIUM: "₹4,999" } },
  "income tax filing": { basePrice: "₹999", packages: { BASIC: "₹1,499", PREMIUM: "₹2,499" } },
  "tds returns (per qtr)": { basePrice: "₹2,499", packages: { BASIC: "₹2,499", STANDARD: "₹4,999", PREMIUM: "₹6,999" } },
  "tax planning": { basePrice: "₹4,999", packages: { BASIC: "₹4,999" } },
  "corporate tax (company)": { basePrice: "₹7,999", packages: { BASIC: "₹9,999" } },
  "payroll  (per month)": { basePrice: "₹3,999", packages: { BASIC: "₹9,999", STANDARD: "₹14,999", PREMIUM: "₹24,999" } },
  "annual filing (aoc-4 & mgt-7/7a)": { basePrice: "₹4,999", packages: { BASIC: "₹9,999", STANDARD: "₹24,999", PREMIUM: "₹34,999" } },
  "board meeting & resolutions": { basePrice: "₹2,999", packages: { BASIC: "₹1,999", STANDARD: "₹2,999", PREMIUM: "₹4,999" } },
  "director appointment/resignation/kyc (per director)": { basePrice: "₹3,999", packages: { BASIC: "₹4,999" } },
  "share transfer & capital changes": { basePrice: "₹5,999", packages: { BASIC: "₹4,999", STANDARD: "₹6,999", PREMIUM: "₹9,999" } },
  "roc default removal": { basePrice: "₹8,999", packages: { BASIC: "₹9,999" } },
  "company strike off (exculding govt fee)": { basePrice: "₹12,999", packages: { BASIC: "₹39,999" } },
  "llp registration": { basePrice: "₹4,999", packages: { BASIC: "₹9,999", STANDARD: "₹14,999", PREMIUM: "₹24,999" } },
  "partnership firm": { basePrice: "₹2,999", packages: { BASIC: "₹7,999", STANDARD: "₹9,999", PREMIUM: "₹14,999" } },
  "sole proprietorship": { basePrice: "₹1,999", packages: { BASIC: "₹1,999" } },
  "section 8 company": { basePrice: "₹8,999", packages: { BASIC: "₹18,999", STANDARD: "₹24,999", PREMIUM: "₹29,999" } },
  "producer company": { basePrice: "₹34,999", packages: { BASIC: "₹34,999" } },
  "nidhi company": { basePrice: "₹34,999", packages: { BASIC: "₹34,999" } },
  "one person company (opc)": { basePrice: "₹4,999", packages: { BASIC: "₹9,999", STANDARD: "₹14,999", PREMIUM: "₹24,999" } },
  "public limited company": { basePrice: "₹15,999", packages: { BASIC: "₹15,999", STANDARD: "₹24,999", PREMIUM: "₹30,999" } },
  "private limited company": { basePrice: "₹9,999", packages: { BASIC: "₹9,999", STANDARD: "₹14,999", PREMIUM: "₹24,999" } },
  "form 3/gumasta": { packages: { BASIC: "₹999" } },
  "pan/tan card apply": { packages: { BASIC: "₹499" } },
  "project report": { packages: { BASIC: "as per request" } },
  "dscr /cma report": { packages: { BASIC: "as per request" } },
};

// Synonyms to CSV mapping
const ALIASES: Record<string, string> = {
  "tds returns": "tds returns (per qtr)",
  "gst registration": "gst filing",
  "gst": "gst filing",
  "income tax": "income tax filing",
  "opc": "one person company (opc)",
  "private limited": "private limited company",
  "public limited": "public limited company",
};

function resolveKey(name: string) {
  const k = key(name);
  const alias = ALIASES[k];
  return alias ? key(alias) : k;
}

export function getServicePricing(name: string): ServicePricing | undefined {
  const k = resolveKey(name);
  return PRICING_RAW[k];
}

export function getBasePrice(name: string): string | undefined {
  return getServicePricing(name)?.basePrice;
}

export function getPackages(name: string): ServicePackages | undefined {
  return getServicePricing(name)?.packages;
}

export function formatPackageLabel(label: string) {
  // unify spelling to "Standard"
  if (label.toLowerCase() === "standrad") return "Standard";
  return label[0].toUpperCase() + label.slice(1).toLowerCase();
}
