"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const reportServices = [
  { title: 'Project Reports', href: '/reports/project-reports' },
  { title: 'CMA Reports', href: '/reports/cma-reports' },
  { title: 'DSCR Reports', href: '/reports/dscr-reports' },
  { title: 'Bank Reconciliation', href: '/reports/bank-reconciliation' },
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
                <Link key={service.href} href={service.href} passHref>
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
