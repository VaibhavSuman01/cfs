"use client";

import { useState } from "react";
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, Target, TrendingUp, DollarSign, FileText } from "lucide-react";

interface TaxSavingResults {
  annualIncome: number;
  currentTax: number;
  recommendedInvestments: Array<{
    name: string;
    amount: number;
    section: string;
    taxSaving: number;
    description: string;
  }>;
  totalTaxSaving: number;
  newTax: number;
  netSaving: number;
}

export default function TaxSavingCalculator() {
  const [formData, setFormData] = useState({
    annualIncome: 800000,
    age: 30,
    currentInvestments: {
      elss: 0,
      ppf: 0,
      nps: 0,
      lifeInsurance: 0,
      healthInsurance: 0,
      homeLoan: 0,
      educationLoan: 0,
      hra: 0,
      standardDeduction: 50000,
    },
    financialYear: "2024-25",
  });

  const [results, setResults] = useState<TaxSavingResults | null>(null);

  const calculateTaxSaving = () => {
    const { annualIncome, age, currentInvestments, financialYear } = formData;
    
    // Calculate current tax
    let taxableIncome = annualIncome - currentInvestments.standardDeduction;
    let currentTax = 0;
    
    if (taxableIncome > 0) {
      if (taxableIncome <= 300000) {
        currentTax = 0;
      } else if (taxableIncome <= 600000) {
        currentTax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        currentTax = 15000 + (taxableIncome - 600000) * 0.10;
      } else if (taxableIncome <= 1200000) {
        currentTax = 55000 + (taxableIncome - 1000000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        currentTax = 85000 + (taxableIncome - 1200000) * 0.20;
      } else {
        currentTax = 145000 + (taxableIncome - 1500000) * 0.30;
      }
    }
    
    // Calculate recommended investments
    const recommendedInvestments = [];
    
    // Section 80C (₹1.5 lakh limit)
    const section80CLimit = 150000;
    const current80C = Math.min(
      currentInvestments.elss + 
      currentInvestments.ppf + 
      currentInvestments.lifeInsurance + 
      currentInvestments.homeLoan,
      section80CLimit
    );
    const remaining80C = Math.max(0, section80CLimit - current80C);
    
    if (remaining80C > 0) {
      recommendedInvestments.push({
        name: "ELSS Mutual Funds",
        amount: Math.min(remaining80C, 50000),
        section: "80C",
        taxSaving: Math.min(remaining80C, 50000) * 0.30,
        description: "Equity Linked Savings Scheme - Tax-free returns after 3 years"
      });
    }
    
    // Section 80CCD(1B) - NPS (₹50,000 limit)
    const npsLimit = 50000;
    const currentNPS = Math.min(currentInvestments.nps, npsLimit);
    const remainingNPS = Math.max(0, npsLimit - currentNPS);
    
    if (remainingNPS > 0) {
      recommendedInvestments.push({
        name: "NPS Contribution",
        amount: remainingNPS,
        section: "80CCD(1B)",
        taxSaving: remainingNPS * 0.30,
        description: "National Pension System - Additional ₹50,000 deduction"
      });
    }
    
    // Section 80D - Health Insurance
    const healthInsuranceLimit = age < 60 ? 25000 : 50000;
    const currentHealthInsurance = Math.min(currentInvestments.healthInsurance, healthInsuranceLimit);
    const remainingHealthInsurance = Math.max(0, healthInsuranceLimit - currentHealthInsurance);
    
    if (remainingHealthInsurance > 0) {
      recommendedInvestments.push({
        name: "Health Insurance",
        amount: remainingHealthInsurance,
        section: "80D",
        taxSaving: remainingHealthInsurance * 0.30,
        description: "Health insurance premium - Up to ₹25,000 (₹50,000 for senior citizens)"
      });
    }
    
    // Section 80E - Education Loan
    if (currentInvestments.educationLoan > 0) {
      recommendedInvestments.push({
        name: "Education Loan Interest",
        amount: currentInvestments.educationLoan,
        section: "80E",
        taxSaving: currentInvestments.educationLoan * 0.30,
        description: "Education loan interest - No upper limit"
      });
    }
    
    // Section 24 - Home Loan Interest
    if (currentInvestments.homeLoan > 0) {
      const homeLoanInterest = Math.min(currentInvestments.homeLoan, 200000);
      recommendedInvestments.push({
        name: "Home Loan Interest",
        amount: homeLoanInterest,
        section: "24",
        taxSaving: homeLoanInterest * 0.30,
        description: "Home loan interest - Up to ₹2,00,000"
      });
    }
    
    // Calculate total tax saving
    const totalTaxSaving = recommendedInvestments.reduce((sum, inv) => sum + inv.taxSaving, 0);
    const newTax = Math.max(0, currentTax - totalTaxSaving);
    const netSaving = totalTaxSaving;
    
    setResults({
      annualIncome,
      currentTax,
      recommendedInvestments,
      totalTaxSaving,
      newTax,
      netSaving
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value[0]
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-rose-100 rounded-full">
                  <Target className="w-8 h-8 text-rose-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Tax Saving Calculator</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Maximize your tax savings with personalized investment recommendations.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Financial Details
                  </CardTitle>
                  <CardDescription>
                    Enter your income and current investments to get tax saving recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Annual Income */}
                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                    <Input
                      id="annualIncome"
                      type="number"
                      value={formData.annualIncome}
                      onChange={(e) => handleInputChange("annualIncome", parseInt(e.target.value) || 0)}
                      placeholder="Enter annual income"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.annualIncome]}
                        onValueChange={(value) => handleSliderChange("annualIncome", value)}
                        max={2000000}
                        min={300000}
                        step={10000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹3,00,000</span>
                        <span>₹20,00,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (Years)</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                      placeholder="Enter your age"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.age]}
                        onValueChange={(value) => handleSliderChange("age", value)}
                        max={80}
                        min={18}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>18 Years</span>
                        <span>80 Years</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Investments */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Current Investments</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="elss">ELSS (₹)</Label>
                        <Input
                          id="elss"
                          type="number"
                          value={formData.currentInvestments.elss}
                          onChange={(e) => handleInputChange("currentInvestments.elss", parseInt(e.target.value) || 0)}
                          placeholder="ELSS amount"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ppf">PPF (₹)</Label>
                        <Input
                          id="ppf"
                          type="number"
                          value={formData.currentInvestments.ppf}
                          onChange={(e) => handleInputChange("currentInvestments.ppf", parseInt(e.target.value) || 0)}
                          placeholder="PPF amount"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nps">NPS (₹)</Label>
                        <Input
                          id="nps"
                          type="number"
                          value={formData.currentInvestments.nps}
                          onChange={(e) => handleInputChange("currentInvestments.nps", parseInt(e.target.value) || 0)}
                          placeholder="NPS amount"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lifeInsurance">Life Insurance (₹)</Label>
                        <Input
                          id="lifeInsurance"
                          type="number"
                          value={formData.currentInvestments.lifeInsurance}
                          onChange={(e) => handleInputChange("currentInvestments.lifeInsurance", parseInt(e.target.value) || 0)}
                          placeholder="Life insurance premium"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="healthInsurance">Health Insurance (₹)</Label>
                        <Input
                          id="healthInsurance"
                          type="number"
                          value={formData.currentInvestments.healthInsurance}
                          onChange={(e) => handleInputChange("currentInvestments.healthInsurance", parseInt(e.target.value) || 0)}
                          placeholder="Health insurance premium"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="homeLoan">Home Loan Interest (₹)</Label>
                        <Input
                          id="homeLoan"
                          type="number"
                          value={formData.currentInvestments.homeLoan}
                          onChange={(e) => handleInputChange("currentInvestments.homeLoan", parseInt(e.target.value) || 0)}
                          placeholder="Home loan interest"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={calculateTaxSaving} className="w-full bg-rose-600 hover:bg-rose-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Tax Savings
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-rose-50 border-rose-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-rose-600">
                            {formatCurrency(results.currentTax)}
                          </div>
                          <div className="text-sm text-rose-700">Current Tax</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(results.totalTaxSaving)}
                          </div>
                          <div className="text-sm text-green-700">Tax Saving</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {formatCurrency(results.newTax)}
                        </div>
                        <div className="text-sm text-blue-700 mb-2">New Tax Liability</div>
                        <div className="flex justify-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {((results.totalTaxSaving / results.currentTax) * 100).toFixed(1)}% Reduction
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommended Investments */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Recommended Investments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {results.recommendedInvestments.map((investment, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-900">{investment.name}</h4>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  {investment.section}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Investment Amount</span>
                                <span className="font-semibold">{formatCurrency(investment.amount)}</span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Tax Saving</span>
                                <span className="font-semibold text-green-600">{formatCurrency(investment.taxSaving)}</span>
                              </div>
                              <p className="text-sm text-gray-600">{investment.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tax Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          Tax Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Annual Income</span>
                            <span className="font-semibold">{formatCurrency(results.annualIncome)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Current Tax</span>
                            <span className="font-semibold text-red-600">{formatCurrency(results.currentTax)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Tax Saving</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.totalTaxSaving)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">New Tax Liability</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.newTax)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your financial details and click "Calculate Tax Savings" to see recommendations</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Tax Saving Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Tax Saving Investment Options</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Section 80C (₹1.5 lakh):</h4>
                    <ul className="space-y-1">
                      <li>• ELSS Mutual Funds</li>
                      <li>• PPF (Public Provident Fund)</li>
                      <li>• Life Insurance Premium</li>
                      <li>• Home Loan Principal</li>
                      <li>• EPF Contributions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Other Sections:</h4>
                    <ul className="space-y-1">
                      <li>• Section 80CCD(1B): NPS (₹50,000)</li>
                      <li>• Section 80D: Health Insurance (₹25,000)</li>
                      <li>• Section 24: Home Loan Interest (₹2,00,000)</li>
                      <li>• Section 80E: Education Loan Interest</li>
                      <li>• Section 80G: Donations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <EnhancedFooter />
    </div>
  );
}
