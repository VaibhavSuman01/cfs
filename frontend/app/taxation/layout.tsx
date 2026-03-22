import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Taxation Services – GST, Income Tax, TDS, Tax Planning",
  description:
    "GST filing, income tax filing, TDS returns, tax planning, corporate tax, payroll tax. Expert taxation services for businesses in India. COM Financial Services.",
  openGraph: {
    title: "Taxation & Tax Filing Services India | COM Financial Services",
    url: absoluteUrl("/taxation"),
  },
  alternates: { canonical: absoluteUrl("/taxation") },
};

export default function TaxationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
