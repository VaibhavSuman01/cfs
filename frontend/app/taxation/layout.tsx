import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/taxation");

export default function TaxationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
