import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Company Registration – Private Limited, OPC, LLP, Section 8",
  description:
    "Register your company in India: Private Limited, Public Limited, One Person Company, Section 8, Nidhi, Producer Company. Fast, compliant company registration with COM Financial Services.",
  openGraph: {
    title: "Company Registration India | COM Financial Services",
    url: absoluteUrl("/company-information"),
  },
  alternates: { canonical: absoluteUrl("/company-information") },
};

export default function CompanyInformationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
