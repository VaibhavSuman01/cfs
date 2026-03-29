import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/trademark-iso");

export default function TrademarkIsoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
