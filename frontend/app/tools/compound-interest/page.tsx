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
import { Calculator, Percent, TrendingUp, DollarSign, Calendar } from "lucide-react";

interface CompoundInterestResults {
  principal: number;
  interestRate: number;
  time: number;
  compoundingFrequency: string;
  maturityAmount: number;
  totalInterest: number;
  effectiveRate: number;
  yearlyData: Array<{
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export default function CompoundInterestCalculator() {
  const [formData, setFormData] = useState({
    principal: 100000,
    interestRate: 8,
    time: 5,
    compoundingFrequency: "yearly", // yearly, half-yearly, quarterly, monthly, daily
  });

  const [results, setResults] = useState<CompoundInterestResults | null>(null);

  const calculateCompoundInterest = () => {
    const { principal, interestRate, time, compoundingFrequency } = formData;
    
    let compoundingPeriods = 1;
    let ratePerPeriod = interestRate / 100;
    
    switch (compoundingFrequency) {
      case "yearly":
        compoundingPeriods = 1;
        break;
      case "half-yearly":
        compoundingPeriods = 2;
        break;
      case "quarterly":
        compoundingPeriods = 4;
        break;
      case "monthly":
        compoundingPeriods = 12;
        break;
      case "daily":
        compoundingPeriods = 365;
        break;
    }
    
    ratePerPeriod = ratePerPeriod / compoundingPeriods;
    const totalPeriods = time * compoundingPeriods;
    
    // Calculate compound interest
    const maturityAmount = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
    const totalInterest = maturityAmount - principal;
    
    // Calculate effective annual rate
    const effectiveRate = (Math.pow(maturityAmount / principal, 1 / time) - 1) * 100;
    
    // Generate yearly data
    const yearlyData = [];
    for (let year = 1; year <= time; year++) {
      const yearPeriods = year * compoundingPeriods;
      const balance = principal * Math.pow(1 + ratePerPeriod, yearPeriods);
      const interest = balance - principal;
      
      yearlyData.push({
        year: year,
        principal: principal,
        interest: interest,
        balance: balance
      });
    }
    
    setResults({
      principal,
      interestRate,
      time,
      compoundingFrequency,
      maturityAmount,
      totalInterest,
      effectiveRate,
      yearlyData
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

  const getCompoundingDescription = () => {
    const descriptions = {
      yearly: "Interest compounded once per year",
      "half-yearly": "Interest compounded twice per year (every 6 months)",
      quarterly: "Interest compounded four times per year (every 3 months)",
      monthly: "Interest compounded twelve times per year (every month)",
      daily: "Interest compounded 365 times per year (every day)"
    };
    return descriptions[formData.compoundingFrequency as keyof typeof descriptions];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-violet-100 rounded-full">
                  <Percent className="w-8 h-8 text-violet-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Compound Interest Calculator</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate the power of compound interest and see how your money grows over time.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Investment Details
                  </CardTitle>
                  <CardDescription>
                    Enter your investment parameters to calculate compound interest
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
                        max={20}
                        min={1}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1%</span>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Period */}
                  <div className="space-y-2">
                    <Label htmlFor="time">Time Period (Years)</Label>
                    <Input
                      id="time"
                      type="number"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", parseInt(e.target.value) || 0)}
                      placeholder="Enter time period"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.time]}
                        onValueChange={(value) => handleSliderChange("time", value)}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 Year</span>
                        <span>50 Years</span>
                      </div>
                    </div>
                  </div>

                  {/* Compounding Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
                    <Select value={formData.compoundingFrequency} onValueChange={(value) => handleInputChange("compoundingFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="half-yearly">Half-yearly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      {getCompoundingDescription()}
                    </p>
                  </div>

                  <Button onClick={calculateCompoundInterest} className="w-full bg-violet-600 hover:bg-violet-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Compound Interest
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-violet-50 border-violet-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-violet-600">
                            {formatCurrency(results.principal)}
                          </div>
                          <div className="text-sm text-violet-700">Principal Amount</div>
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
                            {results.interestRate}% Nominal Rate
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
                            <span className="text-gray-600">Time Period</span>
                            <span className="font-semibold">{results.time} years</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Compounding</span>
                            <span className="font-semibold capitalize">{results.compoundingFrequency}</span>
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

                    {/* Yearly Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Yearly Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {results.yearlyData.map((data, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
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
                      <Percent className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your investment details and click "Calculate Compound Interest" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Compound Interest Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About Compound Interest</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Key Concepts:</h4>
                    <ul className="space-y-1">
                      <li>• Interest earned on both principal and interest</li>
                      <li>• More frequent compounding = higher returns</li>
                      <li>• Time is the most important factor</li>
                      <li>• The "eighth wonder of the world"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Formula:</h4>
                    <div className="bg-white p-3 rounded-lg text-xs">
                      <p className="font-mono">
                        A = P(1 + r/n)^(nt)
                      </p>
                      <p className="mt-2 text-gray-600">
                        Where:<br/>
                        A = Final amount<br/>
                        P = Principal<br/>
                        r = Annual interest rate<br/>
                        n = Compounding frequency<br/>
                        t = Time in years
                      </p>
                    </div>
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
