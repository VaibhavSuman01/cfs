"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getBasePrice } from "@/lib/pricing"

const reportServices = [
  { title: 'Project Reports' },
  { title: 'CMA Reports' },
  { title: 'DSCR Reports' },
  { title: 'Bank Reconciliation' },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Financial Reports</CardTitle>
              <CardDescription className="text-center text-lg">Gain critical insights into your business's financial health and performance.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportServices.map((service) => (
                <Link key={service.title} href={`/contact?service=${encodeURIComponent(service.title)}`} passHref>
                  <Button variant="outline" className="w-full h-full text-left justify-start p-6">
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">{service.title}</span>
                    </div>
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </FadeInSection>
      </main>
      <EnhancedFooter />
    </div>
  );
}
