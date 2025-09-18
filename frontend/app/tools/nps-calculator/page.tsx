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
import { Calculator, Building2, TrendingUp, DollarSign, Calendar } from "lucide-react";

interface NPSResults {
  annualContribution: number;
  expectedReturn: number;
  investmentPeriod: number;
  totalContribution: number;
  totalValue: number;
  totalGains: number;
  annualizedReturn: number;
  monthlyData: Array<{
    year: number;
    contribution: number;
    value: number;
    gain: number;
  }>;
}

export default function NPSCalculator() {
  const [formData, setFormData] = useState({
    annualContribution: 60000,
    expectedReturn: 10,
    investmentPeriod: 20,
    contributionType: "annual", // annual or monthly
    age: 30,
  });

  const [results, setResults] = useState<NPSResults | null>(null);

  const calculateNPS = () => {
    const { annualContribution, expectedReturn, investmentPeriod, contributionType, age } = formData;
    
    let totalContribution = 0;
    let totalValue = 0;
    const monthlyData = [];
    
    // Calculate monthly contribution if needed
    const monthlyContribution = contributionType === "monthly" ? annualContribution / 12 : annualContribution;
    const monthlyRate = expectedReturn / (100 * 12);
    
    if (contributionType === "annual") {
      // Annual contribution calculation
      totalContribution = annualContribution * investmentPeriod;
      
      for (let year = 1; year <= investmentPeriod; year++) {
        const contribution = annualContribution * year;
        const value = annualContribution * ((Math.pow(1 + expectedReturn / 100, year) - 1) / (expectedReturn / 100));
        
        monthlyData.push({
          year: year,
          contribution: contribution,
          value: value,
          gain: value - contribution
        });
      }
      
      totalValue = annualContribution * ((Math.pow(1 + expectedReturn / 100, investmentPeriod) - 1) / (expectedReturn / 100));
    } else {
      // Monthly contribution calculation
      const totalMonths = investmentPeriod * 12;
      totalContribution = monthlyContribution * totalMonths;
      
      for (let year = 1; year <= investmentPeriod; year++) {
        const monthsInYear = 12;
        const contribution = monthlyContribution * (year * monthsInYear);
        let value = 0;
        
        if (monthlyRate > 0) {
          value = monthlyContribution * ((Math.pow(1 + monthlyRate, year * monthsInYear) - 1) / monthlyRate) * (1 + monthlyRate);
        } else {
          value = contribution;
        }
        
        monthlyData.push({
          year: year,
          contribution: contribution,
          value: value,
          gain: value - contribution
        });
      }
      
      if (monthlyRate > 0) {
        totalValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        totalValue = totalContribution;
      }
    }
    
    const totalGains = totalValue - totalContribution;
    const annualizedReturn = Math.pow(totalValue / totalContribution, 1 / investmentPeriod) - 1;
    
    setResults({
      annualContribution,
      expectedReturn,
      investmentPeriod,
      totalContribution,
      totalValue,
      totalGains,
      annualizedReturn: annualizedReturn * 100,
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

  const getRetirementAge = () => {
    return formData.age + formData.investmentPeriod;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Building2 className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">NPS Calculator</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate your National Pension System (NPS) returns and plan your retirement savings.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    NPS Investment Details
                  </CardTitle>
                  <CardDescription>
                    Enter your NPS contribution parameters to calculate potential returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contribution Type */}
                  <div className="space-y-2">
                    <Label htmlFor="contributionType">Contribution Type</Label>
                    <Select value={formData.contributionType} onValueChange={(value) => handleInputChange("contributionType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual Contribution</SelectItem>
                        <SelectItem value="monthly">Monthly Contribution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Annual Contribution */}
                  <div className="space-y-2">
                    <Label htmlFor="annualContribution">
                      {formData.contributionType === "annual" ? "Annual Contribution (₹)" : "Annual Contribution (₹)"}
                    </Label>
                    <Input
                      id="annualContribution"
                      type="number"
                      value={formData.annualContribution}
                      onChange={(e) => handleInputChange("annualContribution", parseInt(e.target.value) || 0)}
                      placeholder="Enter annual contribution amount"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.annualContribution]}
                        onValueChange={(value) => handleSliderChange("annualContribution", value)}
                        max={200000}
                        min={6000}
                        step={1000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹6,000</span>
                        <span>₹2,00,000</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum: ₹6,000 per year, Maximum: ₹2,00,000 per year
                    </p>
                  </div>

                  {/* Expected Return */}
                  <div className="space-y-2">
                    <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.1"
                      value={formData.expectedReturn}
                      onChange={(e) => handleInputChange("expectedReturn", parseFloat(e.target.value) || 0)}
                      placeholder="Enter expected return"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.expectedReturn]}
                        onValueChange={(value) => handleSliderChange("expectedReturn", value)}
                        max={15}
                        min={5}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5%</span>
                        <span>15%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      NPS has historically delivered 8-12% returns
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
                        max={40}
                        min={5}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5 Years</span>
                        <span>40 Years</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum: 5 years, Maximum: Until age 60
                    </p>
                  </div>

                  {/* Current Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Current Age (Years)</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                      placeholder="Enter your current age"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.age]}
                        onValueChange={(value) => handleSliderChange("age", value)}
                        max={60}
                        min={18}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>18 Years</span>
                        <span>60 Years</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Retirement age will be: {getRetirementAge()} years
                    </p>
                  </div>

                  <Button onClick={calculateNPS} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate NPS Returns
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-indigo-50 border-indigo-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {formatCurrency(results.totalContribution)}
                          </div>
                          <div className="text-sm text-indigo-700">Total Contribution</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(results.totalValue)}
                          </div>
                          <div className="text-sm text-blue-700">Retirement Corpus</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatCurrency(results.totalGains)}
                        </div>
                        <div className="text-sm text-green-700 mb-2">Total Gains</div>
                        <div className="flex justify-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {results.expectedReturn}% Expected Return
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {results.annualizedReturn.toFixed(2)}% Annualized Return
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
                            <span className="text-gray-600">Annual Contribution</span>
                            <span className="font-semibold">{formatCurrency(results.annualContribution)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Investment Period</span>
                            <span className="font-semibold">{results.investmentPeriod} years</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Expected Return</span>
                            <span className="font-semibold">{results.expectedReturn}% per annum</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Contribution</span>
                            <span className="font-semibold">{formatCurrency(results.totalContribution)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Gains</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.totalGains)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Retirement Corpus</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.totalValue)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Year-wise Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Investment Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {results.monthlyData.slice(0, 10).map((data, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Year {data.year}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-blue-600">
                                  {formatCurrency(data.value)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Gain: {formatCurrency(data.gain)}
                                </div>
                              </div>
                            </div>
                          ))}
                          {results.monthlyData.length > 10 && (
                            <div className="text-center text-sm text-gray-500 py-2">
                              ... and {results.monthlyData.length - 10} more years
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your NPS details and click "Calculate NPS Returns" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* NPS Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About National Pension System (NPS)</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      <li>• Minimum contribution: ₹6,000 per year</li>
                      <li>• Maximum contribution: ₹2,00,000 per year</li>
                      <li>• Tax benefits under Section 80C and 80CCD</li>
                      <li>• Flexible investment options</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      <li>• Tax deduction up to ₹2 lakh</li>
                      <li>• Market-linked returns</li>
                      <li>• Portable across jobs</li>
                      <li>• Regular pension after retirement</li>
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
