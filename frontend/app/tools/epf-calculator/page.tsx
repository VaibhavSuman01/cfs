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
import { Calculator, Building2, TrendingUp, DollarSign, Calendar } from "lucide-react";

interface EPFResults {
  basicSalary: number;
  epfRate: number;
  servicePeriod: number;
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  epfBalance: number;
  epsBalance: number;
  totalBalance: number;
  monthlyData: Array<{
    month: number;
    employeeContribution: number;
    employerContribution: number;
    epfBalance: number;
    epsBalance: number;
    totalBalance: number;
  }>;
}

export default function EPFCalculator() {
  const [formData, setFormData] = useState({
    basicSalary: 15000,
    epfRate: 12,
    servicePeriod: 5, // in years
    currentAge: 25,
  });

  const [results, setResults] = useState<EPFResults | null>(null);

  const calculateEPF = () => {
    const { basicSalary, epfRate, servicePeriod, currentAge } = formData;
    
    // EPF calculation
    const monthlyBasicSalary = basicSalary;
    const monthlyEpfRate = epfRate / 100;
    
    // Employee contribution (12% of basic salary)
    const monthlyEmployeeContribution = monthlyBasicSalary * monthlyEpfRate;
    
    // Employer contribution breakdown:
    // - 12% of basic salary, but:
    //   - 8.33% goes to EPS (Employee Pension Scheme) - max ₹1,250 per month
    //   - Remaining goes to EPF
    const monthlyEmployerContribution = monthlyBasicSalary * monthlyEpfRate;
    const monthlyEpsContribution = Math.min(monthlyBasicSalary * 0.0833, 1250);
    const monthlyEpfContribution = monthlyEmployerContribution - monthlyEpsContribution;
    
    const totalMonths = servicePeriod * 12;
    let epfBalance = 0;
    let epsBalance = 0;
    const monthlyData = [];
    
    // Calculate month by month (EPF interest is credited annually, but for calculator we compound monthly)
    const annualInterestRate = 0.085; // Current EPF rate is 8.5% (varies by year)
    const monthlyInterestRate = annualInterestRate / 12;
    
    for (let month = 1; month <= totalMonths; month++) {
      // Calculate opening balance for the month (includes previous month's contributions + interest)
      const openingEpfBalance = month === 1 ? 0 : epfBalance;
      const openingEpsBalance = month === 1 ? 0 : epsBalance;
      
      // Add this month's contributions
      epfBalance = openingEpfBalance + monthlyEmployeeContribution + monthlyEpfContribution;
      epsBalance = openingEpsBalance + monthlyEpsContribution;
      
      // Apply monthly interest (compounded)
      epfBalance = epfBalance * (1 + monthlyInterestRate);
      epsBalance = epsBalance * (1 + monthlyInterestRate);
      
      monthlyData.push({
        month: month,
        employeeContribution: monthlyEmployeeContribution * month,
        employerContribution: monthlyEmployerContribution * month,
        epfBalance: epfBalance,
        epsBalance: epsBalance,
        totalBalance: epfBalance + epsBalance
      });
    }
    
    const totalEmployeeContribution = monthlyEmployeeContribution * totalMonths;
    const totalEmployerContribution = monthlyEmployerContribution * totalMonths;
    const totalContribution = totalEmployeeContribution + totalEmployerContribution;
    const totalBalance = epfBalance + epsBalance;
    
    setResults({
      basicSalary,
      epfRate,
      servicePeriod,
      employeeContribution: totalEmployeeContribution,
      employerContribution: totalEmployerContribution,
      totalContribution,
      epfBalance,
      epsBalance,
      totalBalance,
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
    return formData.currentAge + formData.servicePeriod;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-cyan-100 rounded-full">
                  <Building2 className="w-8 h-8 text-cyan-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">EPF Calculator</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate your Employee Provident Fund (EPF) balance and plan your retirement savings.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    EPF Details
                  </CardTitle>
                  <CardDescription>
                    Enter your salary and service details to calculate EPF balance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="basicSalary">Basic Salary (₹)</Label>
                    <Input
                      id="basicSalary"
                      type="number"
                      value={formData.basicSalary}
                      onChange={(e) => handleInputChange("basicSalary", parseInt(e.target.value) || 0)}
                      placeholder="Enter basic salary"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.basicSalary]}
                        onValueChange={(value) => handleSliderChange("basicSalary", value)}
                        max={50000}
                        min={5000}
                        step={1000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹5,000</span>
                        <span>₹50,000</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Basic salary component of your CTC
                    </p>
                  </div>

                  {/* EPF Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="epfRate">EPF Rate (%)</Label>
                    <Input
                      id="epfRate"
                      type="number"
                      value={formData.epfRate}
                      onChange={(e) => handleInputChange("epfRate", parseInt(e.target.value) || 0)}
                      placeholder="Enter EPF rate"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.epfRate]}
                        onValueChange={(value) => handleSliderChange("epfRate", value)}
                        max={12}
                        min={8}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>8%</span>
                        <span>12%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Standard EPF rate is 12% of basic salary
                    </p>
                  </div>

                  {/* Service Period */}
                  <div className="space-y-2">
                    <Label htmlFor="servicePeriod">Service Period (Years)</Label>
                    <Input
                      id="servicePeriod"
                      type="number"
                      value={formData.servicePeriod}
                      onChange={(e) => handleInputChange("servicePeriod", parseInt(e.target.value) || 0)}
                      placeholder="Enter service period"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.servicePeriod]}
                        onValueChange={(value) => handleSliderChange("servicePeriod", value)}
                        max={40}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 Year</span>
                        <span>40 Years</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Total years of service
                    </p>
                  </div>

                  {/* Current Age */}
                  <div className="space-y-2">
                    <Label htmlFor="currentAge">Current Age (Years)</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={formData.currentAge}
                      onChange={(e) => handleInputChange("currentAge", parseInt(e.target.value) || 0)}
                      placeholder="Enter current age"
                    />
                    <div className="px-3">
                      <Slider
                        value={[formData.currentAge]}
                        onValueChange={(value) => handleSliderChange("currentAge", value)}
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

                  <Button onClick={calculateEPF} className="w-full bg-cyan-600 hover:bg-cyan-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate EPF Balance
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-cyan-50 border-cyan-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-cyan-600">
                            {formatCurrency(results.totalContribution)}
                          </div>
                          <div className="text-sm text-cyan-700">Total Contribution</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(results.totalBalance)}
                          </div>
                          <div className="text-sm text-blue-700">Total Balance</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatCurrency(results.totalBalance - results.totalContribution)}
                        </div>
                        <div className="text-sm text-green-700 mb-2">Total Interest Earned</div>
                        <div className="flex justify-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            EPF: {formatCurrency(results.epfBalance)}
                          </Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            EPS: {formatCurrency(results.epsBalance)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Investment Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          EPF Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Basic Salary</span>
                            <span className="font-semibold">{formatCurrency(results.basicSalary)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">EPF Rate</span>
                            <span className="font-semibold">{results.epfRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Service Period</span>
                            <span className="font-semibold">{results.servicePeriod} years</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Employee Contribution</span>
                            <span className="font-semibold">{formatCurrency(results.employeeContribution)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Employer Contribution</span>
                            <span className="font-semibold">{formatCurrency(results.employerContribution)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">EPF Balance</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.epfBalance)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">EPS Balance</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.epsBalance)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Balance</span>
                            <span className="font-semibold text-purple-600">{formatCurrency(results.totalBalance)}</span>
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
                                  {formatCurrency(data.totalBalance)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  EPF: {formatCurrency(data.epfBalance)} | EPS: {formatCurrency(data.epsBalance)}
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
                      <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your EPF details and click "Calculate EPF Balance" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* EPF Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About Employee Provident Fund (EPF)</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      <li>• Employee contributes 12% of basic salary</li>
                      <li>• Employer contributes 12% of basic salary</li>
                      <li>• 8.33% of employer contribution goes to EPS</li>
                      <li>• 3.67% of employer contribution goes to EPF</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      <li>• Tax-free returns</li>
                      <li>• Government-backed security</li>
                      <li>• Can be withdrawn after retirement</li>
                      <li>• Can be used for home loan</li>
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
