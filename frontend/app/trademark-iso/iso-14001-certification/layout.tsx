import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/trademark-iso/iso-14001-certification");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
