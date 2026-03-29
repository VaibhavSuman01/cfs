import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./client-providers";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { getBaseUrl, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS, absoluteUrl } from "@/lib/seo";
import { OrganizationAndWebsiteJsonLd } from "@/components/json-ld";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = getBaseUrl();

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} – Your Business Registration & Compliance Partner`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: baseUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} – Business Registration & Compliance`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} – company registration, GST, tax & compliance India`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – Business Registration & Compliance`,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/og-image.png")],
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-IN": baseUrl,
      en: baseUrl,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "Finance",
  referrer: "strict-origin-when-cross-origin",
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta name="mobile-web-app-capable" content="yes" />
        <OrganizationAndWebsiteJsonLd />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg">
          Skip to main content
        </a>
        <ClientProviders>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
