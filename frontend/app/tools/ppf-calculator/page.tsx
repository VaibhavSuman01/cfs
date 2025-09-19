"use client";

import { useState } from "react";
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, PiggyBank, TrendingUp, DollarSign, Calendar } from "lucide-react";

interface PPFResults {
  totalInvested: number;
  totalValue: number;
  totalInterest: number;
  annualData: Array<{
    year: number;
    invested: number;
    interest: number;
    balance: number;
  }>;
}

export default function PPFCalculator() {
  const [formData, setFormData] = useState({
    annualInvestment: 150000,
    interestRate: 7.1,
    investmentPeriod: 15,
  });

  const [results, setResults] = useState<PPFResults | null>(null);

  const calculatePPF = () => {
    const { annualInvestment, interestRate, investmentPeriod } = formData;
    
    let totalInvested = 0;
    let totalValue = 0;
    let totalInterest = 0;
    const annualData = [];
    
    let balance = 0;
    
    for (let year = 1; year <= investmentPeriod; year++) {
      // Add annual investment at the beginning of the year
      balance += annualInvestment;
      totalInvested += annualInvestment;
      
      // Calculate interest for the year
      const interest = balance * (interestRate / 100);
      balance += interest;
      totalInterest += interest;
      
      annualData.push({
        year: year,
        invested: totalInvested,
        interest: totalInterest,
        balance: balance
      });
    }
    
    totalValue = balance;
    
    setResults({
      totalInvested,
      totalValue,
      totalInterest,
      annualData
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <PiggyBank className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">PPF Calculator</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate your Public Provident Fund (PPF) returns and plan your long-term savings strategy.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    PPF Investment Details
                  </CardTitle>
                  <CardDescription>
                    Enter your PPF investment parameters to calculate potential returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Annual Investment */}
                  <div className="space-y-2">
                    <Label htmlFor="annualInvestment">Annual Investment (₹)</Label>
                    <Input
                      id="annualInvestment"
                      type="number"
                      value={formData.annualInvestment}
                      onChange={(e) => handleInputChange("annualInvestment", parseInt(e.target.value) || 0)}
                      placeholder="Enter annual investment amount"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.annualInvestment]}
                        onValueChange={(value) => handleSliderChange("annualInvestment", value)}
                        max={150000}
                        min={500}
                        step={500}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹500</span>
                        <span>₹1,50,000</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum: ₹500, Maximum: ₹1,50,000 per year
                    </p>
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={(e) => handleInputChange("interestRate", parseFloat(e.target.value) || 0)}
                      placeholder="Enter interest rate"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.interestRate]}
                        onValueChange={(value) => handleSliderChange("interestRate", value)}
                        max={10}
                        min={5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5%</span>
                        <span>10%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Current PPF interest rate is 7.1% (as of 2024)
                    </p>
                  </div>

                  {/* Investment Period */}
                  <div className="space-y-2">
                    <Label htmlFor="investmentPeriod">Investment Period (Years)</Label>
                    <Input
                      id="investmentPeriod"
                      type="number"
                      value={formData.investmentPeriod}
                      onChange={(e) => handleInputChange("investmentPeriod", parseInt(e.target.value) || 0)}
                      placeholder="Enter investment period"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.investmentPeriod]}
                        onValueChange={(value) => handleSliderChange("investmentPeriod", value)}
                        max={30}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 Year</span>
                        <span>30 Years</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      PPF has a minimum lock-in period of 15 years
                    </p>
                  </div>

                  <Button onClick={calculatePPF} className="w-full bg-green-600 hover:bg-green-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate PPF Returns
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(results.totalInvested)}
                          </div>
                          <div className="text-sm text-green-700">Total Invested</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(results.totalValue)}
                          </div>
                          <div className="text-sm text-blue-700">Maturity Value</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {formatCurrency(results.totalInterest)}
                        </div>
                        <div className="text-sm text-purple-700 mb-2">Total Interest Earned</div>
                        <div className="flex justify-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {((results.totalInterest / results.totalInvested) * 100).toFixed(2)}% Total Return
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Investment Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          Investment Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Invested</span>
                            <span className="font-semibold">{formatCurrency(results.totalInvested)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Interest</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.totalInterest)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Maturity Value</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.totalValue)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Return</span>
                            <span className="font-semibold">{((results.totalInterest / results.totalInvested) * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Year-wise Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Year-wise Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {results.annualData.map((data, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Year {data.year}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-blue-600">
                                  {formatCurrency(data.balance)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Interest: {formatCurrency(data.interest)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <PiggyBank className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your PPF details and click "Calculate PPF Returns" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* PPF Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About PPF (Public Provident Fund)</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      <li>• Minimum investment: ₹500 per year</li>
                      <li>• Maximum investment: ₹1,50,000 per year</li>
                      <li>• Lock-in period: 15 years</li>
                      <li>• Tax-free returns under Section 80C</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      <li>• Tax deduction up to ₹1.5 lakh</li>
                      <li>• Tax-free maturity amount</li>
                      <li>• Government-backed security</li>
                      <li>• Can be extended in blocks of 5 years</li>
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
