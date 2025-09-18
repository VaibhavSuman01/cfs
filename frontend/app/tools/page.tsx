"use client";

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Calculator, 
  TrendingUp, 
  Search, 
  FileText, 
  DollarSign, 
  Home, 
  PiggyBank, 
  CreditCard,
  Building2,
  Globe,
  Receipt,
  BarChart3,
  Coins,
  Percent,
  Target,
  Zap
} from "lucide-react";

const toolCategories = [
  {
    name: "Tax Calculators",
    description: "Calculate your taxes and plan your finances",
    icon: Calculator,
    color: "bg-blue-500",
    tools: [
      { name: "Income Tax Calculator", href: "/tools/income-tax-calculator", description: "Calculate your income tax liability", icon: Calculator },
      { name: "Tax Saving Calculator", href: "/tools/tax-saving", description: "Find tax saving investment options", icon: Target },
      { name: "HRA Calculator", href: "/tools/hra-calculator", description: "Calculate HRA exemption", icon: Home },
      { name: "Salary Calculator", href: "/tools/salary-calculator", description: "Calculate take-home salary", icon: DollarSign },
      { name: "Get IT Refund Status", href: "/tools/it-refund-status", description: "Check your income tax refund status", icon: FileText },
    ]
  },
  {
    name: "Loan Calculators",
    description: "Calculate EMIs and loan amounts",
    icon: CreditCard,
    color: "bg-blue-600",
    tools: [
      { name: "EMI Calculator", href: "/tools/emi-calculator", description: "Calculate EMI for any loan", icon: CreditCard },
      { name: "Home Loan EMI Calculator", href: "/tools/home-loan-emi", description: "Calculate home loan EMI", icon: Home },
      { name: "Personal Loan Calculator", href: "/tools/personal-loan-emi", description: "Calculate personal loan EMI", icon: DollarSign },
    ]
  },
  {
    name: "Investment Calculators",
    description: "Plan your investments and returns",
    icon: TrendingUp,
    color: "bg-blue-700",
    tools: [
      { name: "SIP Calculator", href: "/tools/sip-calculator", description: "Calculate SIP returns", icon: TrendingUp },
      { name: "Mutual Fund Calculator", href: "/tools/mutual-fund-calculator", description: "Calculate mutual fund returns", icon: BarChart3 },
      { name: "PPF Calculator", href: "/tools/ppf-calculator", description: "Calculate PPF returns", icon: PiggyBank },
      { name: "NPS Calculator", href: "/tools/nps-calculator", description: "Calculate NPS returns", icon: Building2 },
      { name: "Compound Interest Calculator", href: "/tools/compound-interest", description: "Calculate compound interest", icon: Percent },
    ]
  },
  {
    name: "Deposit Calculators",
    description: "Calculate fixed and recurring deposits",
    icon: PiggyBank,
    color: "bg-blue-800",
    tools: [
      { name: "FD Calculator", href: "/tools/fd-calculator", description: "Calculate fixed deposit returns", icon: PiggyBank },
      { name: "RD Calculator", href: "/tools/rd-calculator", description: "Calculate recurring deposit returns", icon: Coins },
    ]
  },
  {
    name: "GST & Business Tools",
    description: "GST calculations and business utilities",
    icon: Building2,
    color: "bg-blue-900",
    tools: [
      { name: "GST Calculator", href: "/tools/gst-calculator", description: "Calculate GST on products/services", icon: Calculator },
      { name: "HSN Code Finder", href: "/tools/hsn-code-finder", description: "Find HSN codes for products", icon: Search },
      { name: "GST Number Search", href: "/tools/gst-number-search", description: "Search GST numbers", icon: Search },
      { name: "GST Number Search by Name", href: "/tools/gst-search-by-name", description: "Search GST by business name", icon: Building2 },
    ]
  },
  {
    name: "Utility Tools",
    description: "Useful financial and business utilities",
    icon: Zap,
    color: "bg-blue-500",
    tools: [
      { name: "IFSC Code Search", href: "/tools/ifsc-code-search", description: "Find bank IFSC codes", icon: Search },
      { name: "Generate Rent Receipts", href: "/tools/rent-receipts", description: "Generate rent receipts", icon: Receipt },
      { name: "Currency Converter", href: "/tools/currency-converter", description: "Convert between currencies", icon: Globe },
      { name: "Gold Rates Today", href: "/tools/gold-rates", description: "Check current gold rates", icon: Coins },
      { name: "EPF Calculator", href: "/tools/epf-calculator", description: "Calculate EPF contributions", icon: Building2 },
    ]
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <EnhancedHeader />
      
      <main className="pt-20">
        {/* Hero Section */}
        <FadeInSection className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Financial <span className="text-blue-600">Tools & Calculators</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Make informed financial decisions with our comprehensive suite of calculators and tools. 
              From tax planning to investment analysis, we've got you covered.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Calculator className="w-4 h-4 mr-2" />
                25+ Calculators
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Real-time Data
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                Free to Use
              </Badge>
            </div>
          </div>
        </FadeInSection>

        {/* Tools Categories */}
        <FadeInSection className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8">
              {toolCategories.map((category, categoryIndex) => (
                <div key={category.name} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <category.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.tools.map((tool, toolIndex) => (
                      <Link key={tool.name} href={tool.href}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${category.color} text-white`}>
                                <tool.icon className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-sm text-gray-600">
                              {tool.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Features Section */}
        <FadeInSection className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Tools?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our calculators are designed with accuracy, ease of use, and comprehensive coverage in mind.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Accurate Calculations</h3>
                <p className="text-gray-600">
                  All our calculators use the latest tax rates and financial formulas to ensure accurate results.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
                <p className="text-gray-600">
                  Simple, intuitive interfaces that make complex calculations accessible to everyone.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive</h3>
                <p className="text-gray-600">
                  Covering all aspects of personal and business finance in one place.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* CTA Section */}
        <FadeInSection className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Calculating?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Choose any calculator from our comprehensive suite and start making informed financial decisions today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/tools/income-tax-calculator"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Try Income Tax Calculator
              </Link>
              <Link 
                href="/tools/emi-calculator"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Try EMI Calculator
              </Link>
            </div>
          </div>
        </FadeInSection>
      </main>

      <EnhancedFooter />
    </div>
  );
}
