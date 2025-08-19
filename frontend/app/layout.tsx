import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./client-providers";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ComfinServ - Your Business Registration Partner",
  description:
    "Getting your business started with simple, swift and reasonably priced legal services, online.",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="description"
          content="Professional financial services including tax filing, GST registration, company incorporation, and financial auditing."
        />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <ClientProviders>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
