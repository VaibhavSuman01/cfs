export type ServicePackages = {
  BASIC?: string;
  STANDARD?: string;
  PREMIUM?: string;
};

export type ServicePricing = {
  basePrice?: string; // current payment / card base price
  packages?: ServicePackages;
  tooltip?: string; // tooltip text for asterisk
};

// Helper: normalize service keys to improve matching
function key(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

// Map built from frontend/service_prices.csv - CSV is the source of truth
const PRICING_RAW: Record<string, ServicePricing> = {
  "trademark search": { 
    basePrice: "₹1,499*", 
    packages: { BASIC: "₹1,499*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "trademark filing": { 
    basePrice: "₹3,999*", 
    packages: { BASIC: "₹3,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "trademark registration (for msme)": { 
    basePrice: "₹12,999*", 
    packages: { BASIC: "₹12,999*" },
    tooltip: "Inclusive of government fees. Prices may vary based on complexity and industry standards"
  },
  "iso 9001:2015": { 
    basePrice: "As per request*",
    packages: { BASIC: "As per request*" },
    tooltip: "Prices vary based on company size, complexity, and industry standards"
  },
  "iso 14001:2015": { 
    basePrice: "As per request*",
    packages: { BASIC: "As per request*" },
    tooltip: "Prices vary based on company size, complexity, and industry standards"
  },
  "iso 45001:2018": { 
    basePrice: "As per request*",
    packages: { BASIC: "As per request*" },
    tooltip: "Prices vary based on company size, complexity, and industry standards"
  },
  "gst registration": { 
    basePrice: "₹2,999*", 
    packages: { BASIC: "₹2,999*", STANDARD: "₹4,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "gst filing": { 
    basePrice: "₹1,499*",
    packages: { BASIC: "₹1,499*" },
    tooltip: "Prices vary based on filing frequency, complexity, and industry standards"
  },
  "income tax filing": { 
    basePrice: "₹1,499*", 
    packages: { BASIC: "₹1,499*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "tds returns (per qtr)": { 
    basePrice: "₹2,499*", 
    packages: { BASIC: "₹2,499*", STANDARD: "₹4,999*", PREMIUM: "₹6,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "tax planning": { 
    basePrice: "₹4,999*", 
    packages: { BASIC: "₹4,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "corporate tax (company)": { 
    basePrice: "₹9,999*", 
    packages: { BASIC: "₹9,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "payroll tax (per month)": { 
    basePrice: "₹9,999*", 
    packages: { BASIC: "₹9,999*", STANDARD: "₹14,999*", PREMIUM: "₹24,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "annual filing (aoc-4 & mgt-7)": { 
    basePrice: "₹9,999*", 
    packages: { BASIC: "₹9,999*", STANDARD: "₹24,999*", PREMIUM: "₹34,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "board meeting & resolutions": { 
    basePrice: "₹1,999*", 
    packages: { BASIC: "₹1,999*", STANDARD: "₹2,999*", PREMIUM: "₹4,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "director appointment/resignation": { 
    basePrice: "₹4,999*", 
    packages: { BASIC: "₹4,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "share transfer & capital changes": { 
    basePrice: "₹4,999*", 
    packages: { BASIC: "₹4,999*", STANDARD: "₹6,999*", PREMIUM: "₹9,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "roc default removal": { 
    basePrice: "₹9,999*", 
    packages: { BASIC: "₹9,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "company strike off": { 
    basePrice: "₹39,999*", 
    packages: { BASIC: "₹39,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "llp registration": { 
    basePrice: "₹9,999*", 
    packages: { BASIC: "₹9,999*", STANDARD: "₹14,999*", PREMIUM: "₹24,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "partnership firm": { 
    basePrice: "₹7,999*", 
    packages: { BASIC: "₹7,999*", STANDARD: "₹9,999*", PREMIUM: "₹14,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "sole proprietorship": { 
    basePrice: "₹1,999*", 
    packages: { BASIC: "₹1,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "section 8 company": { 
    basePrice: "₹18,999*", 
    packages: { BASIC: "₹18,999*", STANDARD: "₹24,999*", PREMIUM: "₹29,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "producer company": { 
    basePrice: "₹34,999*", 
    packages: { BASIC: "₹34,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "nidhi company": { 
    basePrice: "₹34,999*", 
    packages: { BASIC: "₹34,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "one person company (opc)": { 
    basePrice: "₹9,999*", 
    packages: { BASIC: "₹9,999*", STANDARD: "₹14,999*", PREMIUM: "₹24,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "public limited company": { 
    basePrice: "₹15,999*", 
    packages: { BASIC: "₹15,999*", STANDARD: "₹24,999*", PREMIUM: "₹30,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "private limited company": { 
    basePrice: "₹9,999*", 
    packages: { BASIC: "₹9,999*", STANDARD: "₹14,999*", PREMIUM: "₹24,999*" },
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "form 3/gumasta": { 
    basePrice: "₹999*",
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "pan/tan card apply": { 
    basePrice: "₹499*",
    tooltip: "Prices may vary based on complexity and industry standards"
  },
  "project report": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on project complexity, scope, and industry standards"
  },
  "dscr/cma report": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on report complexity, scope, and industry standards"
  },
  // Additional services not in CSV - all as per request
  "epfo filing": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on filing complexity, employee count, and industry standards"
  },
  "esic filing": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on filing complexity, employee count, and industry standards"
  },
  "pt tax filing": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on filing complexity, employee count, and industry standards"
  },
  "fassai food license": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on license type, business size, and industry standards"
  },
  "iec registration": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on business type, export volume, and industry standards"
  },
  "industry license": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on industry type, business size, and regulatory requirements"
  },
  "msme udyam registration": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on business size, complexity, and industry standards"
  },
  "ngo registration": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on NGO type, activities, and regulatory requirements"
  },
  "startup india registration": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on startup stage, documentation, and industry standards"
  },
  "digital signature": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on certificate type, validity period, and industry standards"
  },
  "copyright registration": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on work type, complexity, and industry standards"
  },
  "iso 14001 certification": { 
    basePrice: "As per request*",
    tooltip: "Prices vary based on company size, complexity, and industry standards"
  },
};

// Synonyms to CSV mapping
const ALIASES: Record<string, string> = {
  "tds returns": "tds returns (per qtr)",
  "gst": "gst registration",
  "gst filing": "gst registration",
  "income tax": "income tax filing",
  "opc": "one person company (opc)",
  "private limited": "private limited company",
  "public limited": "public limited company",
  "annual filing": "annual filing (aoc-4 & mgt-7)",
  "board resolutions": "board meeting & resolutions",
  "director changes": "director appointment/resignation",
  "share transfer": "share transfer & capital changes",
  "roc compliance": "annual filing (aoc-4 & mgt-7)",
  "llp": "llp registration",
  "partnership": "partnership firm",
  "sole prop": "sole proprietorship",
  "section 8": "section 8 company",
  "producer": "producer company",
  "nidhi": "nidhi company",
  "gumusta": "form 3/gumasta",
  "shop establishment": "form 3/gumasta",
  "pan apply": "pan/tan card apply",
  "tan apply": "pan/tan card apply",
  "cma report": "dscr/cma report",
  "dscr report": "dscr/cma report",
  "bank reconciliation": "project report",
  "project reports": "project report",
  "iso 9001": "iso 9001:2015",
  "iso 14001": "iso 14001:2015",
  "iso 45001": "iso 45001:2018",
  "trademark": "trademark registration (for msme)",
  "trademark search": "trademark search",
  "trademark filing": "trademark filing",
  "iso certification": "iso 9001:2015",
  "iso 9001 certification": "iso 9001:2015",
  "iso 14001 certification": "iso 14001:2015",
  "iso 45001 certification": "iso 45001:2018",
  "corporate tax": "corporate tax (company)",
  "corporate tax filing": "corporate tax (company)",
  "payroll": "payroll tax (per month)",
  "payroll tax": "payroll tax (per month)",
  "epfo": "epfo filing",
  "esic": "esic filing",
  "pt tax": "pt tax filing",
  "pt filing": "pt tax filing",
  "fssai": "fassai food license",
  "food license": "fassai food license",
  "import export": "iec registration",
  "import export code": "iec registration",
  "msme": "msme udyam registration",
  "udyam": "msme udyam registration",
  "ngo": "ngo registration",
  "startup india": "startup india registration",
  "digital signature certificate": "digital signature",
  "dsc": "digital signature",
  "copyright": "copyright registration",
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

export function getTooltipText(name: string): string | undefined {
  return getServicePricing(name)?.tooltip;
}

export function hasTooltip(name: string): boolean {
  const pricing = getServicePricing(name);
  return !!(pricing?.tooltip);
}
