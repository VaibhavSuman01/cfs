import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/advisory");

export default function AdvisoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
