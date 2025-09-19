"use client";

import { useState } from "react";
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, PieChart, Info } from "lucide-react";

export default function SIPCalculatorPage() {
  const [formData, setFormData] = useState({
    monthlyInvestment: "",
    expectedReturn: "",
    investmentPeriod: "",
    stepUpRate: "0"
  });

  const [results, setResults] = useState<{
    totalInvested: number;
    totalValue: number;
    totalGains: number;
    absoluteReturn: number;
    annualizedReturn: number;
    monthlyData: Array<{
      month: number;
      investment: number;
      cumulativeInvestment: number;
      cumulativeValue: number;
    }>;
    months: number;
  } | null>(null);

  const calculateSIP = () => {
    const monthlyInvestment = parseFloat(formData.monthlyInvestment) || 0;
    const expectedReturn = parseFloat(formData.expectedReturn) || 0;
    const investmentPeriod = parseFloat(formData.investmentPeriod) || 0;
    const stepUpRate = parseFloat(formData.stepUpRate) || 0;

    if (monthlyInvestment <= 0 || expectedReturn < 0 || investmentPeriod <= 0) {
      setResults(null);
      return;
    }

    const months = investmentPeriod * 12;
    const monthlyRate = expectedReturn / (12 * 100);
    const stepUpMonthlyRate = stepUpRate / (12 * 100);

    let totalInvested = 0;
    let totalValue = 0;
    let monthlyData = [];

    for (let month = 1; month <= months; month++) {
      // Calculate current investment amount with step-up
      const currentInvestment = monthlyInvestment * Math.pow(1 + stepUpMonthlyRate, month - 1);
      totalInvested += currentInvestment;

      // Calculate future value of this month's investment
      const remainingMonths = months - month + 1;
      const futureValue = currentInvestment * Math.pow(1 + monthlyRate, remainingMonths);
      totalValue += futureValue;

      // Store data for first 12 months and last 12 months
      if (month <= 12 || month > months - 12) {
        monthlyData.push({
          month,
          investment: currentInvestment,
          cumulativeInvestment: totalInvested,
          cumulativeValue: totalValue
        });
      }
    }

    const totalGains = totalValue - totalInvested;
    const absoluteReturn = (totalGains / totalInvested) * 100;
    const annualizedReturn = Math.pow(totalValue / totalInvested, 12 / months) - 1;

    setResults({
      totalInvested,
      totalValue,
      totalGains,
      absoluteReturn,
      annualizedReturn,
      monthlyData,
      months
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value[0].toString()
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <EnhancedHeader />
      
      <main className="pt-20">
        <FadeInSection className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  SIP Calculator
                </h1>
                <p className="text-xl text-gray-600">
                  Calculate your Systematic Investment Plan returns and build wealth over time
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      SIP Details
                    </CardTitle>
                    <CardDescription>
                      Enter your SIP investment details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="monthlyInvestment">Monthly Investment (₹)</Label>
                      <Input
                        id="monthlyInvestment"
                        type="number"
                        placeholder="Enter monthly SIP amount"
                        value={formData.monthlyInvestment}
                        onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                      />
                      <div className="mt-2">
                        <Slider
                          value={[parseFloat(formData.monthlyInvestment) || 0]}
                          onValueChange={(value) => handleSliderChange('monthlyInvestment', value)}
                          max={100000}
                          min={500}
                          step={500}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>₹500</span>
                          <span>₹1L</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                      <Input
                        id="expectedReturn"
                        type="number"
                        placeholder="Enter expected return"
                        value={formData.expectedReturn}
                        onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                        step="0.1"
                      />
                      <div className="mt-2">
                        <Slider
                          value={[parseFloat(formData.expectedReturn) || 0]}
                          onValueChange={(value) => handleSliderChange('expectedReturn', value)}
                          max={20}
                          min={5}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5%</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="investmentPeriod">Investment Period (Years)</Label>
                      <Input
                        id="investmentPeriod"
                        type="number"
                        placeholder="Enter investment period"
                        value={formData.investmentPeriod}
                        onChange={(e) => handleInputChange('investmentPeriod', e.target.value)}
                      />
                      <div className="mt-2">
                        <Slider
                          value={[parseFloat(formData.investmentPeriod) || 0]}
                          onValueChange={(value) => handleSliderChange('investmentPeriod', value)}
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
                    </div>

                    <div>
                      <Label htmlFor="stepUpRate">Annual Step-up Rate (%)</Label>
                      <Input
                        id="stepUpRate"
                        type="number"
                        placeholder="Enter step-up rate (optional)"
                        value={formData.stepUpRate}
                        onChange={(e) => handleInputChange('stepUpRate', e.target.value)}
                        step="0.1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Increase your SIP amount annually by this percentage
                      </p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold">SIP Benefits</p>
                          <p>• Rupee cost averaging</p>
                          <p>• Power of compounding</p>
                          <p>• Disciplined investing</p>
                          <p>• Long-term wealth creation</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={calculateSIP} className="w-full">
                      Calculate SIP Returns
                    </Button>
                  </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-6">
                  {results && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            SIP Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Total Value</p>
                            <p className="text-3xl font-bold text-purple-600">
                              ₹{results.totalValue.toLocaleString()}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Total Invested</p>
                              <p className="font-semibold">₹{results.totalInvested.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Gains</p>
                              <p className="font-semibold text-green-600">₹{results.totalGains.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Absolute Return</p>
                              <p className="font-semibold">{results.absoluteReturn.toFixed(2)}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Annualized Return</p>
                              <p className="font-semibold">{(results.annualizedReturn * 100).toFixed(2)}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5" />
                            Investment Breakdown
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Principal Amount</span>
                              <span className="font-semibold">₹{results.totalInvested.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Gains</span>
                              <span className="font-semibold text-green-600">₹{results.totalGains.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                                style={{ width: `${(results.totalInvested / results.totalValue) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Principal: {((results.totalInvested / results.totalValue) * 100).toFixed(1)}%</span>
                              <span>Gains: {((results.totalGains / results.totalValue) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Monthly Progress</CardTitle>
                          <CardDescription>
                            First 12 months and last 12 months
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {results.monthlyData.map((data: any, index: number) => (
                              <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-0">
                                <div>
                                  <p className="font-medium">Month {data.month}</p>
                                  <p className="text-gray-600 text-xs">
                                    Investment: ₹{data.investment.toLocaleString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">₹{data.cumulativeValue.toLocaleString()}</p>
                                  <p className="text-gray-600 text-xs">
                                    Invested: ₹{data.cumulativeInvestment.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {!results && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Enter your SIP details and click "Calculate SIP Returns" to see results</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </main>

      <EnhancedFooter />
    </div>
  );
}
