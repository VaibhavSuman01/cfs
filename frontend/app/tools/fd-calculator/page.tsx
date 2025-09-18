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
import { Calculator, PiggyBank, TrendingUp, DollarSign, Calendar } from "lucide-react";

interface FDResults {
  principal: number;
  interestRate: number;
  tenure: number;
  maturityAmount: number;
  totalInterest: number;
  effectiveRate: number;
  monthlyData: Array<{
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export default function FDCalculator() {
  const [formData, setFormData] = useState({
    principal: 100000,
    interestRate: 6.5,
    tenure: 1,
    tenureType: "years", // years or months
    interestType: "compound", // simple or compound
    compoundingFrequency: "quarterly", // monthly, quarterly, half-yearly, yearly
  });

  const [results, setResults] = useState<FDResults | null>(null);

  const calculateFD = () => {
    const { principal, interestRate, tenure, tenureType, interestType, compoundingFrequency } = formData;
    
    // Convert tenure to years
    const tenureInYears = tenureType === "months" ? tenure / 12 : tenure;
    
    let maturityAmount = 0;
    let totalInterest = 0;
    const monthlyData = [];
    
    if (interestType === "simple") {
      // Simple interest calculation
      totalInterest = principal * (interestRate / 100) * tenureInYears;
      maturityAmount = principal + totalInterest;
      
      // For simple interest, show yearly data
      for (let year = 1; year <= Math.ceil(tenureInYears); year++) {
        const yearInterest = principal * (interestRate / 100) * Math.min(year, tenureInYears);
        const balance = principal + yearInterest;
        
        monthlyData.push({
          month: year,
          principal: principal,
          interest: yearInterest,
          balance: balance
        });
      }
    } else {
      // Compound interest calculation
      let compoundingPeriods = 1;
      let ratePerPeriod = interestRate / 100;
      
      switch (compoundingFrequency) {
        case "monthly":
          compoundingPeriods = 12;
          break;
        case "quarterly":
          compoundingPeriods = 4;
          break;
        case "half-yearly":
          compoundingPeriods = 2;
          break;
        case "yearly":
          compoundingPeriods = 1;
          break;
      }
      
      ratePerPeriod = ratePerPeriod / compoundingPeriods;
      const totalPeriods = tenureInYears * compoundingPeriods;
      
      maturityAmount = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
      totalInterest = maturityAmount - principal;
      
      // Generate monthly data for compound interest
      for (let period = 1; period <= totalPeriods; period++) {
        const balance = principal * Math.pow(1 + ratePerPeriod, period);
        const interest = balance - principal;
        
        monthlyData.push({
          month: period,
          principal: principal,
          interest: interest,
          balance: balance
        });
      }
    }
    
    // Calculate effective annual rate
    const effectiveRate = (Math.pow(maturityAmount / principal, 1 / tenureInYears) - 1) * 100;
    
    setResults({
      principal,
      interestRate,
      tenure: tenureInYears,
      maturityAmount,
      totalInterest,
      effectiveRate,
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <PiggyBank className="w-8 h-8 text-orange-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Fixed Deposit Calculator</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate your Fixed Deposit returns and plan your savings with our comprehensive FD calculator.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    FD Investment Details
                  </CardTitle>
                  <CardDescription>
                    Enter your Fixed Deposit parameters to calculate potential returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Principal Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="principal">Principal Amount (₹)</Label>
                    <Input
                      id="principal"
                      type="number"
                      value={formData.principal}
                      onChange={(e) => handleInputChange("principal", parseInt(e.target.value) || 0)}
                      placeholder="Enter principal amount"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.principal]}
                        onValueChange={(value) => handleSliderChange("principal", value)}
                        max={10000000}
                        min={1000}
                        step={1000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹1,000</span>
                        <span>₹1,00,00,000</span>
                      </div>
                    </div>
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
                        max={12}
                        min={3}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>3%</span>
                        <span>12%</span>
                      </div>
                    </div>
                  </div>

                  {/* Tenure */}
                  <div className="space-y-2">
                    <Label htmlFor="tenure">Tenure</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tenure"
                        type="number"
                        value={formData.tenure}
                        onChange={(e) => handleInputChange("tenure", parseInt(e.target.value) || 0)}
                        placeholder="Enter tenure"
                        className="flex-1"
                      />
                      <Select value={formData.tenureType} onValueChange={(value) => handleInputChange("tenureType", value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="years">Years</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="px-3">
                      <Slider
                        value={[formData.tenure]}
                        onValueChange={(value) => handleSliderChange("tenure", value)}
                        max={formData.tenureType === "years" ? 10 : 120}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 {formData.tenureType === "years" ? "Year" : "Month"}</span>
                        <span>{formData.tenureType === "years" ? "10 Years" : "120 Months"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interest Type */}
                  <div className="space-y-2">
                    <Label htmlFor="interestType">Interest Type</Label>
                    <Select value={formData.interestType} onValueChange={(value) => handleInputChange("interestType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple Interest</SelectItem>
                        <SelectItem value="compound">Compound Interest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Compounding Frequency (only for compound interest) */}
                  {formData.interestType === "compound" && (
                    <div className="space-y-2">
                      <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
                      <Select value={formData.compoundingFrequency} onValueChange={(value) => handleInputChange("compoundingFrequency", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="half-yearly">Half-yearly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button onClick={calculateFD} className="w-full bg-orange-600 hover:bg-orange-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate FD Returns
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {formatCurrency(results.principal)}
                          </div>
                          <div className="text-sm text-orange-700">Principal Amount</div>
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
                            {results.effectiveRate.toFixed(2)}% Effective Rate
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
                            <span className="text-gray-600">Principal Amount</span>
                            <span className="font-semibold">{formatCurrency(results.principal)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Interest Rate</span>
                            <span className="font-semibold">{results.interestRate}% per annum</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tenure</span>
                            <span className="font-semibold">{results.tenure.toFixed(2)} years</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Interest</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.totalInterest)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Maturity Amount</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.maturityAmount)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Effective Rate</span>
                            <span className="font-semibold">{results.effectiveRate.toFixed(2)}% per annum</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Progress Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Investment Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {results.monthlyData.slice(0, 12).map((data, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">
                                  {formData.tenureType === "years" ? `Year ${data.month}` : `Month ${data.month}`}
                                </span>
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
                              ... and {results.monthlyData.length - 12} more periods
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <PiggyBank className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your FD details and click "Calculate FD Returns" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* FD Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About Fixed Deposits</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      <li>• Guaranteed returns on your investment</li>
                      <li>• Flexible tenure options</li>
                      <li>• Higher interest rates than savings accounts</li>
                      <li>• TDS applicable on interest earned</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      <li>• Safe and secure investment</li>
                      <li>• Fixed returns regardless of market conditions</li>
                      <li>• Easy to open and manage</li>
                      <li>• Can be used as collateral for loans</li>
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
