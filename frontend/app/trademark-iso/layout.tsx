import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Trademark & ISO Certification – Brand Protection & Quality",
  description:
    "Trademark registration, ISO 9001, ISO 14001 certification in India. Protect your brand and get quality certifications with COM Financial Services.",
  openGraph: {
    title: "Trademark Registration & ISO Certification | COM Financial Services",
    url: absoluteUrl("/trademark-iso"),
  },
  alternates: { canonical: absoluteUrl("/trademark-iso") },
};

export default function TrademarkIsoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
