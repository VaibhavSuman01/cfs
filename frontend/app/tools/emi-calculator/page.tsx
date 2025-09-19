"use client";

import { useState } from "react";
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, PieChart, Info } from "lucide-react";

export default function EMICalculatorPage() {
  const [formData, setFormData] = useState({
    loanAmount: "",
    interestRate: "",
    tenure: "",
    tenureType: "years",
    loanType: "personal"
  });

  const [results, setResults] = useState<{
    emi: number;
    totalAmount: number;
    totalInterest: number;
    principal: number;
    tenure: number;
    schedule: Array<{
      month: number;
      emi: number;
      principal: number;
      interest: number;
      balance: number;
    }>;
  } | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(formData.loanAmount) || 0;
    const rate = parseFloat(formData.interestRate) || 0;
    let tenure = parseFloat(formData.tenure) || 0;

    // Convert tenure to months if in years
    if (formData.tenureType === "years") {
      tenure = tenure * 12;
    }

    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      setResults(null);
      return;
    }

    // Monthly interest rate
    const monthlyRate = rate / (12 * 100);

    // EMI calculation using the formula
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);

    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    // Calculate amortization schedule for first 12 months
    const schedule = [];
    let remainingPrincipal = principal;

    for (let month = 1; month <= Math.min(12, tenure); month++) {
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = emi - interestPayment;
      remainingPrincipal -= principalPayment;

      schedule.push({
        month,
        emi: emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingPrincipal)
      });
    }

    setResults({
      emi: emi,
      totalAmount: totalAmount,
      totalInterest: totalInterest,
      principal: principal,
      tenure: tenure,
      schedule: schedule
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <EnhancedHeader />
      
      <main className="pt-20">
        <FadeInSection className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  EMI Calculator
                </h1>
                <p className="text-xl text-gray-600">
                  Calculate your Equated Monthly Installment (EMI) for any loan
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Loan Details
                    </CardTitle>
                    <CardDescription>
                      Enter your loan amount, interest rate, and tenure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="loanType">Loan Type</Label>
                      <Select value={formData.loanType} onValueChange={(value) => handleInputChange('loanType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal Loan</SelectItem>
                          <SelectItem value="home">Home Loan</SelectItem>
                          <SelectItem value="car">Car Loan</SelectItem>
                          <SelectItem value="education">Education Loan</SelectItem>
                          <SelectItem value="business">Business Loan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        placeholder="Enter loan amount"
                        value={formData.loanAmount}
                        onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                      />
                      <div className="mt-2">
                        <Slider
                          value={[parseFloat(formData.loanAmount) || 0]}
                          onValueChange={(value) => handleSliderChange('loanAmount', value)}
                          max={10000000}
                          min={10000}
                          step={10000}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>₹10K</span>
                          <span>₹1Cr</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        placeholder="Enter interest rate"
                        value={formData.interestRate}
                        onChange={(e) => handleInputChange('interestRate', e.target.value)}
                        step="0.1"
                      />
                      <div className="mt-2">
                        <Slider
                          value={[parseFloat(formData.interestRate) || 0]}
                          onValueChange={(value) => handleSliderChange('interestRate', value)}
                          max={30}
                          min={5}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5%</span>
                          <span>30%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tenure">Tenure</Label>
                        <Input
                          id="tenure"
                          type="number"
                          placeholder="Enter tenure"
                          value={formData.tenure}
                          onChange={(e) => handleInputChange('tenure', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tenureType">Tenure Type</Label>
                        <Select value={formData.tenureType} onValueChange={(value) => handleInputChange('tenureType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="years">Years</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold">EMI Formula</p>
                          <p>EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]</p>
                          <p className="text-xs mt-1">Where P = Principal, R = Monthly Interest Rate, N = Number of Months</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={calculateEMI} className="w-full">
                      Calculate EMI
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
                            EMI Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Monthly EMI</p>
                            <p className="text-3xl font-bold text-green-600">
                              ₹{results.emi.toLocaleString()}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Principal Amount</p>
                              <p className="font-semibold">₹{results.principal.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Interest</p>
                              <p className="font-semibold">₹{results.totalInterest.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Amount</p>
                              <p className="font-semibold">₹{results.totalAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tenure</p>
                              <p className="font-semibold">{results.tenure} months</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5" />
                            Amortization Schedule
                          </CardTitle>
                          <CardDescription>
                            First 12 months breakdown
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {results.schedule.map((payment, index) => (
                              <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-0">
                                <div>
                                  <p className="font-medium">Month {payment.month}</p>
                                  <p className="text-gray-600 text-xs">
                                    Principal: ₹{payment.principal.toLocaleString()} | 
                                    Interest: ₹{payment.interest.toLocaleString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">₹{payment.emi.toLocaleString()}</p>
                                  <p className="text-gray-600 text-xs">
                                    Balance: ₹{payment.balance.toLocaleString()}
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
                        <p className="text-gray-600">Enter your loan details and click "Calculate EMI" to see results</p>
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
