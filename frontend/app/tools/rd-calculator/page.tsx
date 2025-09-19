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
import { Calculator, Coins, TrendingUp, DollarSign, Calendar } from "lucide-react";

interface RDResults {
  monthlyDeposit: number;
  interestRate: number;
  tenure: number;
  totalDeposits: number;
  maturityAmount: number;
  totalInterest: number;
  monthlyData: Array<{
    month: number;
    deposit: number;
    interest: number;
    balance: number;
  }>;
}

export default function RDCalculator() {
  const [formData, setFormData] = useState({
    monthlyDeposit: 5000,
    interestRate: 6.5,
    tenure: 12, // in months
  });

  const [results, setResults] = useState<RDResults | null>(null);

  const calculateRD = () => {
    const { monthlyDeposit, interestRate, tenure } = formData;
    
    let totalDeposits = 0;
    let totalInterest = 0;
    const monthlyData = [];
    
    // RD calculation using the formula: A = P * [((1 + r)^n - 1) / r] * (1 + r)
    // where P = monthly deposit, r = monthly interest rate, n = number of months
    const monthlyRate = interestRate / (100 * 12);
    const totalDepositsAmount = monthlyDeposit * tenure;
    
    let maturityAmount = 0;
    if (monthlyRate > 0) {
      maturityAmount = monthlyDeposit * ((Math.pow(1 + monthlyRate, tenure) - 1) / monthlyRate) * (1 + monthlyRate);
    } else {
      maturityAmount = totalDepositsAmount;
    }
    
    totalInterest = maturityAmount - totalDepositsAmount;
    
    // Generate monthly data
    for (let month = 1; month <= tenure; month++) {
      const deposits = monthlyDeposit * month;
      let balance = 0;
      
      if (monthlyRate > 0) {
        balance = monthlyDeposit * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        balance = deposits;
      }
      
      const interest = balance - deposits;
      
      monthlyData.push({
        month: month,
        deposit: deposits,
        interest: interest,
        balance: balance
      });
    }
    
    setResults({
      monthlyDeposit,
      interestRate,
      tenure,
      totalDeposits: totalDepositsAmount,
      maturityAmount,
      totalInterest,
      monthlyData
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Coins className="w-8 h-8 text-purple-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Recurring Deposit Calculator</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate your Recurring Deposit returns and plan your regular savings with our RD calculator.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    RD Investment Details
                  </CardTitle>
                  <CardDescription>
                    Enter your Recurring Deposit parameters to calculate potential returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Monthly Deposit */}
                  <div className="space-y-2">
                    <Label htmlFor="monthlyDeposit">Monthly Deposit (₹)</Label>
                    <Input
                      id="monthlyDeposit"
                      type="number"
                      value={formData.monthlyDeposit}
                      onChange={(e) => handleInputChange("monthlyDeposit", parseInt(e.target.value) || 0)}
                      placeholder="Enter monthly deposit amount"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.monthlyDeposit]}
                        onValueChange={(value) => handleSliderChange("monthlyDeposit", value)}
                        max={100000}
                        min={100}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹100</span>
                        <span>₹1,00,000</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum deposit varies by bank (typically ₹100-₹500)
                    </p>
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
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
                        min={3}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>3%</span>
                        <span>10%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Current RD rates typically range from 5-7% per annum
                    </p>
                  </div>

                  {/* Tenure */}
                  <div className="space-y-2">
                    <Label htmlFor="tenure">Tenure (Months)</Label>
                    <Input
                      id="tenure"
                      type="number"
                      value={formData.tenure}
                      onChange={(e) => handleInputChange("tenure", parseInt(e.target.value) || 0)}
                      placeholder="Enter tenure in months"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.tenure]}
                        onValueChange={(value) => handleSliderChange("tenure", value)}
                        max={120}
                        min={6}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>6 Months</span>
                        <span>120 Months (10 Years)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum tenure is usually 6 months, maximum varies by bank
                    </p>
                  </div>

                  <Button onClick={calculateRD} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate RD Returns
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatCurrency(results.totalDeposits)}
                          </div>
                          <div className="text-sm text-purple-700">Total Deposits</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(results.maturityAmount)}
                          </div>
                          <div className="text-sm text-blue-700">Maturity Amount</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatCurrency(results.totalInterest)}
                        </div>
                        <div className="text-sm text-green-700 mb-2">Total Interest Earned</div>
                        <div className="flex justify-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {results.interestRate}% Interest Rate
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {((results.totalInterest / results.totalDeposits) * 100).toFixed(2)}% Total Return
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
                            <span className="text-gray-600">Monthly Deposit</span>
                            <span className="font-semibold">{formatCurrency(results.monthlyDeposit)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tenure</span>
                            <span className="font-semibold">{results.tenure} months ({(results.tenure / 12).toFixed(1)} years)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Interest Rate</span>
                            <span className="font-semibold">{results.interestRate}% per annum</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Deposits</span>
                            <span className="font-semibold">{formatCurrency(results.totalDeposits)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Interest</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.totalInterest)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Maturity Amount</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.maturityAmount)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Monthly Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Monthly Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {results.monthlyData.slice(0, 12).map((data, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Month {data.month}</span>
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
                          {results.monthlyData.length > 12 && (
                            <div className="text-center text-sm text-gray-500 py-2">
                              ... and {results.monthlyData.length - 12} more months
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your RD details and click "Calculate RD Returns" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* RD Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About Recurring Deposits (RD)</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      <li>• Regular monthly deposits</li>
                      <li>• Fixed interest rate for the entire tenure</li>
                      <li>• Flexible deposit amounts</li>
                      <li>• Premature withdrawal allowed with penalty</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      <li>• Disciplined savings habit</li>
                      <li>• Higher returns than savings accounts</li>
                      <li>• Safe and secure investment</li>
                      <li>• Easy to open and manage</li>
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
