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
import { Calculator, TrendingUp, DollarSign, Percent, Calendar } from "lucide-react";

interface MutualFundResults {
  totalInvested: number;
  totalValue: number;
  totalGains: number;
  absoluteReturn: number;
  annualizedReturn: number;
  monthlyData: Array<{
    month: number;
    invested: number;
    value: number;
    gain: number;
  }>;
}

export default function MutualFundCalculator() {
  const [formData, setFormData] = useState({
    investmentAmount: 10000,
    expectedReturn: 12,
    investmentPeriod: 5,
    investmentType: "lumpsum", // lumpsum or sip
    sipFrequency: "monthly", // monthly, quarterly, yearly
  });

  const [results, setResults] = useState<MutualFundResults | null>(null);

  const calculateMutualFund = () => {
    const { investmentAmount, expectedReturn, investmentPeriod, investmentType, sipFrequency } = formData;
    
    let totalInvested = 0;
    let totalValue = 0;
    const monthlyData = [];
    
    if (investmentType === "lumpsum") {
      totalInvested = investmentAmount;
      totalValue = investmentAmount * Math.pow(1 + expectedReturn / 100, investmentPeriod);
      
      // For lumpsum, show yearly data
      for (let year = 1; year <= investmentPeriod; year++) {
        const value = investmentAmount * Math.pow(1 + expectedReturn / 100, year);
        monthlyData.push({
          month: year,
          invested: investmentAmount,
          value: value,
          gain: value - investmentAmount
        });
      }
    } else {
      // SIP calculation
      const frequencyMultiplier = sipFrequency === "monthly" ? 12 : sipFrequency === "quarterly" ? 4 : 1;
      const monthlyRate = expectedReturn / (100 * frequencyMultiplier);
      const totalInstallments = investmentPeriod * frequencyMultiplier;
      
      totalInvested = investmentAmount * totalInstallments;
      
      // Calculate SIP future value
      if (monthlyRate > 0) {
        totalValue = investmentAmount * ((Math.pow(1 + monthlyRate, totalInstallments) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        totalValue = totalInvested;
      }
      
      // Generate monthly data for SIP
      for (let month = 1; month <= totalInstallments; month++) {
        const invested = investmentAmount * month;
        let value = 0;
        
        if (monthlyRate > 0) {
          value = investmentAmount * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate);
        } else {
          value = invested;
        }
        
        monthlyData.push({
          month: month,
          invested: invested,
          value: value,
          gain: value - invested
        });
      }
    }
    
    const totalGains = totalValue - totalInvested;
    const absoluteReturn = (totalGains / totalInvested) * 100;
    const annualizedReturn = Math.pow(totalValue / totalInvested, 1 / investmentPeriod) - 1;
    
    setResults({
      totalInvested,
      totalValue,
      totalGains,
      absoluteReturn,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Mutual Fund Calculator</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate potential returns from your mutual fund investments with our comprehensive calculator.
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
                    Enter your investment parameters to calculate potential returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Investment Type */}
                  <div className="space-y-2">
                    <Label htmlFor="investmentType">Investment Type</Label>
                    <Select value={formData.investmentType} onValueChange={(value) => handleInputChange("investmentType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lumpsum">Lump Sum Investment</SelectItem>
                        <SelectItem value="sip">SIP (Systematic Investment Plan)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Investment Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="investmentAmount">Investment Amount (₹)</Label>
                    <Input
                      id="investmentAmount"
                      type="number"
                      value={formData.investmentAmount}
                      onChange={(e) => handleInputChange("investmentAmount", parseInt(e.target.value) || 0)}
                      placeholder="Enter investment amount"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.investmentAmount]}
                        onValueChange={(value) => handleSliderChange("investmentAmount", value)}
                        max={1000000}
                        min={1000}
                        step={1000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹1,000</span>
                        <span>₹10,00,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Expected Return */}
                  <div className="space-y-2">
                    <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      value={formData.expectedReturn}
                      onChange={(e) => handleInputChange("expectedReturn", parseFloat(e.target.value) || 0)}
                      placeholder="Enter expected return"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.expectedReturn]}
                        onValueChange={(value) => handleSliderChange("expectedReturn", value)}
                        max={25}
                        min={5}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5%</span>
                        <span>25%</span>
                      </div>
                    </div>
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
                  </div>

                  {/* SIP Frequency (only for SIP) */}
                  {formData.investmentType === "sip" && (
                    <div className="space-y-2">
                      <Label htmlFor="sipFrequency">SIP Frequency</Label>
                      <Select value={formData.sipFrequency} onValueChange={(value) => handleInputChange("sipFrequency", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button onClick={calculateMutualFund} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Returns
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
                          <div className="text-sm text-blue-700">Total Value</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {formatCurrency(results.totalGains)}
                        </div>
                        <div className="text-sm text-purple-700 mb-2">Total Gains</div>
                        <div className="flex justify-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {results.absoluteReturn.toFixed(2)}% Absolute Return
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
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
                          Investment Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Invested</span>
                            <span className="font-semibold">{formatCurrency(results.totalInvested)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Value</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.totalValue)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Gains</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.totalGains)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Absolute Return</span>
                            <span className="font-semibold">{results.absoluteReturn.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Annualized Return</span>
                            <span className="font-semibold">{results.annualizedReturn.toFixed(2)}%</span>
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
                                  {formData.investmentType === "lumpsum" ? `Year ${data.month}` : `Month ${data.month}`}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-green-600">
                                  {formatCurrency(data.value)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  +{formatCurrency(data.gain)}
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
                      <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your investment details and click "Calculate Returns" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <EnhancedFooter />
    </div>
  );
}
