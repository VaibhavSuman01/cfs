import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Support – Help & Customer Care",
  description:
    "Get help with company registration, tax filing, and compliance. COM Financial Services support and customer care.",
  alternates: { canonical: absoluteUrl("/support") },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
