import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us – Get Expert Business Registration Help",
  description:
    "Contact COM Financial Services for company registration, GST, tax filing, trademark, and compliance. Get a callback or quote from our expert team. Quick response guaranteed.",
  openGraph: {
    title: "Contact COM Financial Services – Business Registration & Support",
    url: absoluteUrl("/contact"),
  },
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
