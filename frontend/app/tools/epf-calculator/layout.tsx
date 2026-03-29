import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/tools/epf-calculator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
