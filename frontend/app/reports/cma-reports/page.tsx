"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CmaReportsPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">CMA Reports</CardTitle>
              <CardDescription className="text-center text-lg">Credit Monitoring Arrangement reports for loan applications and financial analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                A Credit Monitoring Arrangement (CMA) report is a detailed analysis of a company's financial performance and projections. It is a critical document required by banks and financial institutions to assess the creditworthiness of a business when considering loan applications.
              </p>
              <Link href={`/contact?service=${encodeURIComponent('CMA Reports')}`} passHref>
                <Button className="w-full">Book This Service</Button>
              </Link>
            </CardContent>
          </Card>
        </FadeInSection>
      </main>
      <EnhancedFooter />
    </div>
  );
}
