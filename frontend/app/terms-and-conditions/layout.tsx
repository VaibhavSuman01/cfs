import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions of use for COM Financial Services services and website.",
  robots: { index: true, follow: true },
  alternates: { canonical: absoluteUrl("/terms-and-conditions") },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
