import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Business Advisory – Strategy, Compliance, Fund Raising",
  description:
    "Business strategy consulting, legal compliance advisory, financial planning, startup mentoring, tax planning, and fund raising assistance. ComfinServ advisory services.",
  openGraph: {
    title: "Business Advisory & Consulting | ComfinServ",
    url: absoluteUrl("/advisory"),
  },
  alternates: { canonical: absoluteUrl("/advisory") },
};

export default function AdvisoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
