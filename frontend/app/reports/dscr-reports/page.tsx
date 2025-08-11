"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DscrReportsPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=DSCR+Reports`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">DSCR Reports</CardTitle>
              <CardDescription className="text-center text-lg">Assess your debt service coverage ratio to evaluate your ability to repay loans.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                The Debt Service Coverage Ratio (DSCR) is a measure of the cash flow available to pay current debt obligations. A DSCR report is crucial for lenders to determine a company's ability to generate sufficient cash to cover its debt payments, and is a key factor in credit analysis.
              </p>
              <Button onClick={handleBookService} className="w-full">Book This Service</Button>
            </CardContent>
          </Card>
        </FadeInSection>
      </main>
      <EnhancedFooter />
    </div>
  );
}
