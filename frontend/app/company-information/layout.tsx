import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/company-information");

export default function CompanyInformationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
