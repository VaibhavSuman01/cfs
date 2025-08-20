"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BankReconciliationPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Bank Reconciliation</CardTitle>
              <CardDescription className="text-center text-lg">Ensure your financial records are accurate and consistent with your bank statements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                A bank reconciliation is the process of matching the balances in a company's accounting records for a cash account to the corresponding information on a bank statement. The goal of this process is to ascertain the differences between the two, and to book changes to the accounting records as appropriate.
              </p>
              <Link href={`/contact?service=${encodeURIComponent('Bank Reconciliation')}`} passHref>
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
