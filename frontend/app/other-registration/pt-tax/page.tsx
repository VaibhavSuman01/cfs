"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PtTaxPage() {
  const router = useRouter();

  const handleBookService = () => {
    router.push(`/contact?service=PT+Tax+Registration`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Professional Tax (PT) Registration</CardTitle>
              <CardDescription className="text-center text-lg">Comply with state-level tax regulations for professionals and employers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Professional Tax is a tax levied by state governments on individuals who earn a living through any profession, trade, or employment. It is a mandatory registration for businesses and professionals in applicable states, and it is deducted from the salary or wages of employees.
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
