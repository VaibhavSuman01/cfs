import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us – India's Trusted Business Registration Partner",
  description:
    "COM Financial Services is India's leading business registration and compliance platform. Learn about our story, team, and commitment to simple, swift company registration and legal services.",
  openGraph: {
    title: "About COM Financial Services – Business Registration & Compliance",
    description:
      "India's trusted platform for company registration, GST, taxation, and compliance. Over 10,000+ businesses served.",
    url: absoluteUrl("/about"),
  },
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
