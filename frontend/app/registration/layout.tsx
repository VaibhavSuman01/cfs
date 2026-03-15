import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Registration – GST, LLP, MSME, FSSAI, PAN, TAN",
  description:
    "GST registration, LLP, partnership, MSME Udyam, FSSAI, PAN, TAN, Startup India, NGO, and more. Complete business registration services in India.",
  openGraph: {
    title: "Business Registrations – GST, LLP, MSME | ComfinServ",
    url: absoluteUrl("/registration"),
  },
  alternates: { canonical: absoluteUrl("/registration") },
};

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
