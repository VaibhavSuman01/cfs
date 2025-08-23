"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { FadeInSection } from '@/components/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GstRegistrationPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      <main className="container mx-auto px-4 py-16">
        <FadeInSection>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">GST Registration</CardTitle>
              <CardDescription className="text-center text-lg">Comply with the Goods and Services Tax law in India.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl my-4 max-w-xs mx-auto">
                <div className="text-2xl font-bold text-blue-600">₹2,999</div>
                <div className="text-sm text-gray-600">Starting Price</div>
              </div>
              <p className="text-left">
                Goods and Services Tax (GST) is an indirect tax used in India on the supply of goods and services. GST Filing is mandatory for businesses whose turnover exceeds the prescribed threshold limit. It helps in consolidating multiple indirect taxes into a single tax structure.
              </p>
              <Link href={`/contact?service=${encodeURIComponent('GST Registration')}`} passHref>
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
