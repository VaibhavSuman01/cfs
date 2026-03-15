import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ROC Returns & Company Compliance – Annual Filing, Board Resolutions",
  description:
    "ROC annual filing, board resolutions, director changes, share transfer. Stay compliant with MCA with ComfinServ ROC returns and company management services.",
  openGraph: {
    title: "ROC Returns & Company Compliance | ComfinServ",
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
