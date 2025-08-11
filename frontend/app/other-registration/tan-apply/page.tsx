"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TanApplyPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=TAN+Apply`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">TAN Application</CardTitle>
              <CardDescription className="text-center text-lg">A prerequisite for deducting or collecting tax at source (TDS/TCS).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Tax Deduction and Collection Account Number (TAN) is a 10-digit alphanumeric number required to be obtained by all persons who are responsible for deducting or collecting tax. It is mandatory to quote TAN in all TDS/TCS returns, payments, and any other communication with the Income Tax Department.
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
