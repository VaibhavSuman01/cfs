import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/registration/msme-udyam-registration");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
