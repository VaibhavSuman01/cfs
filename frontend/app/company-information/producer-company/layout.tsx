import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/company-information/producer-company");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
