import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ComfinServ privacy policy. How we collect, use, and protect your data.",
  alternates: { canonical: absoluteUrl("/privacy-policy") },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
