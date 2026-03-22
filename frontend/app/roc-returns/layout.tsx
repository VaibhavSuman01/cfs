import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ROC Returns & Company Compliance – Annual Filing, Board Resolutions",
  description:
    "ROC annual filing, board resolutions, director changes, share transfer. Stay compliant with MCA with COM Financial Services ROC returns and company management services.",
  openGraph: {
    title: "ROC Returns & Company Compliance | COM Financial Services",
    url: absoluteUrl("/roc-returns"),
  },
  alternates: { canonical: absoluteUrl("/roc-returns") },
};

export default function RocReturnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
