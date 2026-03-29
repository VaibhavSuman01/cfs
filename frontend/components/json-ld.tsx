import {
  getBaseUrl,
  SITE_NAME,
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SEO_SCHEMA_TOPICS,
  absoluteUrl,
} from "@/lib/seo";
import { getServiceOffersForSchema } from "@/lib/seo-pages";

const baseUrl = getBaseUrl();

/** Organization + WebSite schema for homepage and brand. Injected in root layout. */
export function OrganizationAndWebsiteJsonLd() {
  const catalogItems = getServiceOffersForSchema().map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: item.name,
        url: item.url,
      },
    },
  }));

  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: SITE_NAME,
    alternateName: [...SITE_ALTERNATE_NAMES],
    description: SITE_DESCRIPTION,
    url: baseUrl,
    logo: absoluteUrl("/android-chrome-512x512.png"),
    sameAs: [] as string[],
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: SEO_SCHEMA_TOPICS,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${SITE_NAME} services`,
      itemListElement: catalogItems,
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: baseUrl,
    inLanguage: "en-IN",
    publisher: { "@id": `${baseUrl}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${baseUrl}/tools?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationWithId = {
    ...organization,
    "@id": `${baseUrl}#organization`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationWithId),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(website),
        }}
      />
    </>
  );
}

/** Use on service/product pages for local business or service schema. */
export function ServiceJsonLd({
  name,
  description,
  path,
  breadcrumbItems,
}: {
  name: string;
  description: string;
  path: string;
  breadcrumbItems?: { name: string; path: string }[];
}) {
  const url = absoluteUrl(path);
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: { "@id": `${baseUrl}#organization` },
    areaServed: { "@type": "Country", name: "India" },
    availableLanguage: ["English", "Hindi"],
  };

  if (breadcrumbItems && breadcrumbItems.length > 0) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** FAQ schema for pages with Q&A. */
export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
