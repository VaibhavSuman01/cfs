"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PricingDisplay } from "@/components/ui/pricing-display"

const reportServices = [
  { 
    title: 'Project Reports',
    slug: 'project-reports',
    priceKey: "project report",
    description: "Comprehensive project reports for business planning and funding"
  },
  { 
    title: 'CMA Reports',
    slug: 'cma-reports',
    priceKey: "dscr/cma report",
    description: "Credit Monitoring Arrangement reports for loan applications"
  },
  { 
    title: 'DSCR Reports',
    slug: 'dscr-reports',
    priceKey: "dscr/cma report",
    description: "Debt Service Coverage Ratio reports for financial analysis"
  },
  { 
    title: 'Bank Reconciliation',
    slug: 'bank-reconciliation',
    priceKey: "bank reconciliation",
    description: "Bank statement reconciliation and financial auditing"
  },
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
                <Link key={service.title} href={`/reports/${service.slug}`} passHref>
                  <Button variant="outline" className="w-full h-full text-left justify-start p-6">
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">{service.title}</span>
                      <span className="text-sm text-gray-600 mt-1">{service.description}</span>
                      <span className="text-lg font-bold text-blue-600 mt-2">
                        {service.priceKey ? (
                          <PricingDisplay serviceName={service.priceKey} />
                        ) : (
                          service.priceKey
                        )}
                      </span>
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
