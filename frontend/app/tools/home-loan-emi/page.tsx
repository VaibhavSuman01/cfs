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
import { Calculator, Home, TrendingUp, DollarSign, Calendar } from "lucide-react";

interface HomeLoanResults {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  totalAmount: number;
  totalInterest: number;
  monthlyData: Array<{
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export default function HomeLoanEMICalculator() {
  const [formData, setFormData] = useState({
    loanAmount: 5000000,
    interestRate: 8.5,
    tenure: 20,
    downPayment: 1000000,
    propertyValue: 6000000,
  });

  const [results, setResults] = useState<HomeLoanResults | null>(null);

  const calculateHomeLoanEMI = () => {
    const { loanAmount, interestRate, tenure } = formData;
    
    // Calculate EMI using the formula
    const monthlyRate = interestRate / (100 * 12);
    const tenureInMonths = tenure * 12;
    
    let emi = 0;
    if (monthlyRate > 0) {
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
            (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
    } else {
      emi = loanAmount / tenureInMonths;
    }
    
    const totalAmount = emi * tenureInMonths;
    const totalInterest = totalAmount - loanAmount;
    
    // Generate monthly data for first 12 months
    const monthlyData = [];
    let balance = loanAmount;
    
    for (let month = 1; month <= Math.min(12, tenureInMonths); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance = Math.max(0, balance - principalPayment);
      
      monthlyData.push({
        month: month,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });
    }
    
    setResults({
      loanAmount,
      interestRate,
      tenure,
      emi,
      totalAmount,
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

  const getLoanToValueRatio = () => {
    return ((formData.loanAmount / formData.propertyValue) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <Home className="w-8 h-8 text-amber-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Home Loan EMI Calculator</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate your home loan EMI and plan your home purchase with our comprehensive calculator.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Loan Details
                  </CardTitle>
                  <CardDescription>
                    Enter your home loan parameters to calculate EMI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Value */}
                  <div className="space-y-2">
                    <Label htmlFor="propertyValue">Property Value (₹)</Label>
                    <Input
                      id="propertyValue"
                      type="number"
                      value={formData.propertyValue}
                      onChange={(e) => handleInputChange("propertyValue", parseInt(e.target.value) || 0)}
                      placeholder="Enter property value"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.propertyValue]}
                        onValueChange={(value) => handleSliderChange("propertyValue", value)}
                        max={20000000}
                        min={1000000}
                        step={100000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹10,00,000</span>
                        <span>₹2,00,00,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div className="space-y-2">
                    <Label htmlFor="downPayment">Down Payment (₹)</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      value={formData.downPayment}
                      onChange={(e) => handleInputChange("downPayment", parseInt(e.target.value) || 0)}
                      placeholder="Enter down payment"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.downPayment]}
                        onValueChange={(value) => handleSliderChange("downPayment", value)}
                        max={formData.propertyValue * 0.5}
                        min={formData.propertyValue * 0.1}
                        step={50000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹{Math.round(formData.propertyValue * 0.1).toLocaleString()}</span>
                        <span>₹{Math.round(formData.propertyValue * 0.5).toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Down Payment: {((formData.downPayment / formData.propertyValue) * 100).toFixed(1)}% | 
                      LTV Ratio: {getLoanToValueRatio()}%
                    </p>
                  </div>

                  {/* Loan Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange("loanAmount", parseInt(e.target.value) || 0)}
                      placeholder="Enter loan amount"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.loanAmount]}
                        onValueChange={(value) => handleSliderChange("loanAmount", value)}
                        max={formData.propertyValue - formData.downPayment}
                        min={1000000}
                        step={100000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹10,00,000</span>
                        <span>₹{Math.round(formData.propertyValue - formData.downPayment).toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Loan Amount = Property Value - Down Payment
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
                        max={15}
                        min={6}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>6%</span>
                        <span>15%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Current home loan rates typically range from 8-12%
                    </p>
                  </div>

                  {/* Tenure */}
                  <div className="space-y-2">
                    <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                    <Input
                      id="tenure"
                      type="number"
                      value={formData.tenure}
                      onChange={(e) => handleInputChange("tenure", parseInt(e.target.value) || 0)}
                      placeholder="Enter loan tenure"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.tenure]}
                        onValueChange={(value) => handleSliderChange("tenure", value)}
                        max={30}
                        min={5}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5 Years</span>
                        <span>30 Years</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Maximum tenure is typically 30 years
                    </p>
                  </div>

                  <Button onClick={calculateHomeLoanEMI} className="w-full bg-amber-600 hover:bg-amber-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate EMI
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-amber-600">
                            {formatCurrency(results.emi)}
                          </div>
                          <div className="text-sm text-amber-700">Monthly EMI</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(results.totalAmount)}
                          </div>
                          <div className="text-sm text-blue-700">Total Amount</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatCurrency(results.totalInterest)}
                        </div>
                        <div className="text-sm text-green-700 mb-2">Total Interest</div>
                        <div className="flex justify-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {((results.totalInterest / results.loanAmount) * 100).toFixed(1)}% of Loan Amount
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Loan Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          Loan Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Property Value</span>
                            <span className="font-semibold">{formatCurrency(formData.propertyValue)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Down Payment</span>
                            <span className="font-semibold">{formatCurrency(formData.downPayment)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Loan Amount</span>
                            <span className="font-semibold">{formatCurrency(results.loanAmount)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Interest Rate</span>
                            <span className="font-semibold">{results.interestRate}% per annum</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tenure</span>
                            <span className="font-semibold">{results.tenure} years</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Monthly EMI</span>
                            <span className="font-semibold text-amber-600">{formatCurrency(results.emi)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Interest</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.totalInterest)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.totalAmount)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Monthly Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Monthly Breakdown (First 12 Months)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {results.monthlyData.map((data, index) => (
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
                                  Principal: {formatCurrency(data.principal)} | Interest: {formatCurrency(data.interest)}
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
                      <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your loan details and click "Calculate EMI" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Home Loan Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About Home Loans</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      <li>• Lower interest rates than personal loans</li>
                      <li>• Longer repayment tenure (up to 30 years)</li>
                      <li>• Tax benefits on interest and principal</li>
                      <li>• Flexible repayment options</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tax Benefits:</h4>
                    <ul className="space-y-1">
                      <li>• Section 24: Interest up to ₹2,00,000</li>
                      <li>• Section 80C: Principal up to ₹1,50,000</li>
                      <li>• Section 80EE: Additional ₹50,000 (first-time buyers)</li>
                      <li>• Section 80EEA: Additional ₹1,50,000 (affordable housing)</li>
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
