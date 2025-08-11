"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TaxPlanAnalysisPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=Tax+Plan+Analysis`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Tax Plan Analysis</CardTitle>
              <CardDescription className="text-center text-lg">Optimize your tax strategy and minimize your tax liabilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                A comprehensive tax plan analysis involves reviewing your financial situation to ensure you are taking advantage of all available tax deductions, credits, and strategies. We help you develop a proactive plan to manage your tax obligations effectively and legally, aligning with your financial goals.
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
