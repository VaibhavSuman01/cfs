import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("/registration/startup-india-registration");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
