import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/taxation/income-tax");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
