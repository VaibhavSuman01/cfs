import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Business & Tax Calculators",
  description:
    "Use free online calculators: income tax, GST, EMI, salary, SIP, PPF, NPS, HRA, currency converter, IFSC search, HSN code finder, and more. ComfinServ tools for Indian businesses.",
  openGraph: {
    title: "Free Tax & Business Calculators | ComfinServ",
    url: absoluteUrl("/tools"),
  },
  alternates: { canonical: absoluteUrl("/tools") },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
