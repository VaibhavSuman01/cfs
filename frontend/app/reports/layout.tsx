import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reports – Project Reports, CMA, DSCR, Bank Reconciliation",
  description:
    "Project reports, CMA reports, DSCR reports, bank reconciliation for loans and business. Professional financial reports by COM Financial Services.",
  openGraph: {
    title: "Business & Financial Reports | COM Financial Services",
    url: absoluteUrl("/reports"),
  },
  alternates: { canonical: absoluteUrl("/reports") },
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
