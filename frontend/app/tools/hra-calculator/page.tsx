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
import { Badge } from "@/components/ui/badge";
import { Calculator, Home, TrendingUp, DollarSign, FileText } from "lucide-react";

interface HRAResults {
  basicSalary: number;
  hraReceived: number;
  rentPaid: number;
  cityType: string;
  hraExemption: number;
  taxableHra: number;
  taxSaving: number;
  effectiveRate: number;
}

export default function HRACalculator() {
  const [formData, setFormData] = useState({
    basicSalary: 500000,
    hraReceived: 200000,
    rentPaid: 180000,
    cityType: "metro", // metro or non-metro
    rentPaidTo: "landlord", // landlord or relative
  });

  const [results, setResults] = useState<HRAResults | null>(null);

  const calculateHRA = () => {
    const { basicSalary, hraReceived, rentPaid, cityType, rentPaidTo } = formData;
    
    // Calculate HRA exemption based on the three conditions (as per Indian Income Tax Act)
    const condition1 = hraReceived; // Actual HRA received
    const condition2 = Math.max(0, rentPaid - (basicSalary * 0.1)); // Rent paid minus 10% of basic salary (must be >= 0)
    const condition3 = cityType === "metro" ? basicSalary * 0.5 : basicSalary * 0.4; // 50% of basic for metro, 40% for non-metro
    
    // HRA exemption is the minimum of the three conditions
    const hraExemption = Math.min(condition1, condition2, condition3);
    
    // If rent is paid to relative, additional scrutiny applies (IT Act provisions)
    // Rent should be at fair market value, but for calculator purposes, we allow it
    let finalHraExemption = hraExemption;
    if (rentPaidTo === "relative") {
      // IT Department may scrutinize if rent is excessive
      // For calculation, we apply the exemption but note this in the display
      finalHraExemption = hraExemption;
    }
    
    const taxableHra = Math.max(0, hraReceived - finalHraExemption);
    
    // Estimate tax saving (assuming average tax rate)
    // This is an approximation - actual tax saving depends on tax slab
    const estimatedTaxRate = basicSalary > 1500000 ? 0.30 : 
                             basicSalary > 1200000 ? 0.20 :
                             basicSalary > 900000 ? 0.15 :
                             basicSalary > 600000 ? 0.10 : 0.05;
    const taxSaving = finalHraExemption * estimatedTaxRate;
    
    // Calculate effective exemption rate
    const effectiveRate = hraReceived > 0 ? (finalHraExemption / hraReceived) * 100 : 0;
    
    setResults({
      basicSalary,
      hraReceived,
      rentPaid,
      cityType,
      hraExemption: finalHraExemption,
      taxableHra,
      taxSaving,
      effectiveRate
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCityTypeDescription = () => {
    return formData.cityType === "metro" 
      ? "Metro cities (Delhi, Mumbai, Chennai, Kolkata) - 50% of basic salary"
      : "Non-metro cities - 40% of basic salary";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <EnhancedHeader />
      
      <main className="pt-20">
        <FadeInSection className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  HRA Calculator
                </h1>
                <p className="text-xl text-gray-600">
                  Calculate your House Rent Allowance (HRA) exemption and maximize your tax savings
                </p>
              </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    HRA Details
                  </CardTitle>
                  <CardDescription>
                    Enter your salary and rent details to calculate HRA exemption
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
                    <p className="text-xs text-gray-500">
                      Basic salary component of your CTC
                    </p>
                  </div>

                  {/* HRA Received */}
                  <div className="space-y-2">
                    <Label htmlFor="hraReceived">HRA Received (₹)</Label>
                    <Input
                      id="hraReceived"
                      type="number"
                      value={formData.hraReceived}
                      onChange={(e) => handleInputChange("hraReceived", parseInt(e.target.value) || 0)}
                      placeholder="Enter HRA received"
                    />
                    <p className="text-xs text-gray-500">
                      House Rent Allowance component of your salary
                    </p>
                  </div>

                  {/* Rent Paid */}
                  <div className="space-y-2">
                    <Label htmlFor="rentPaid">Annual Rent Paid (₹)</Label>
                    <Input
                      id="rentPaid"
                      type="number"
                      value={formData.rentPaid}
                      onChange={(e) => handleInputChange("rentPaid", parseInt(e.target.value) || 0)}
                      placeholder="Enter annual rent paid"
                    />
                    <p className="text-xs text-gray-500">
                      Total rent paid in the financial year
                    </p>
                  </div>

                  {/* City Type */}
                  <div className="space-y-2">
                    <Label htmlFor="cityType">City Type</Label>
                    <Select value={formData.cityType} onValueChange={(value) => handleInputChange("cityType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metro">Metro City</SelectItem>
                        <SelectItem value="non-metro">Non-Metro City</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      {getCityTypeDescription()}
                    </p>
                  </div>

                  {/* Rent Paid To */}
                  <div className="space-y-2">
                    <Label htmlFor="rentPaidTo">Rent Paid To</Label>
                    <Select value={formData.rentPaidTo} onValueChange={(value) => handleInputChange("rentPaidTo", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="landlord">Landlord</SelectItem>
                        <SelectItem value="relative">Relative</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      If paid to relative, additional conditions may apply
                    </p>
                  </div>

                  <Button onClick={calculateHRA} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate HRA Exemption
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-emerald-50 border-emerald-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(results.hraExemption)}
                          </div>
                          <div className="text-sm text-emerald-700">HRA Exemption</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(results.taxableHra)}
                          </div>
                          <div className="text-sm text-blue-700">Taxable HRA</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatCurrency(results.taxSaving)}
                        </div>
                        <div className="text-sm text-green-700 mb-2">Annual Tax Saving</div>
                        <div className="flex justify-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {results.effectiveRate.toFixed(1)}% Exemption Rate
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Detailed Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          HRA Calculation Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Basic Salary</span>
                            <span className="font-semibold">{formatCurrency(results.basicSalary)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">HRA Received</span>
                            <span className="font-semibold">{formatCurrency(results.hraReceived)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Rent Paid</span>
                            <span className="font-semibold">{formatCurrency(results.rentPaid)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">City Type</span>
                            <span className="font-semibold capitalize">{results.cityType}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">HRA Exemption</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.hraExemption)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Taxable HRA</span>
                            <span className="font-semibold text-red-600">{formatCurrency(results.taxableHra)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tax Saving (30% rate)</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.taxSaving)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* HRA Rules */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          HRA Exemption Rules
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Three Conditions for HRA Exemption:</h4>
                            <ul className="space-y-1 text-blue-700">
                              <li>1. Actual HRA received</li>
                              <li>2. Rent paid minus 10% of basic salary</li>
                              <li>3. 50% of basic salary (metro) or 40% (non-metro)</li>
                            </ul>
                            <p className="text-blue-600 mt-2">
                              <strong>HRA exemption = Minimum of the above three conditions</strong>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your HRA details and click "Calculate HRA Exemption" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* HRA Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About House Rent Allowance (HRA)</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Key Points:</h4>
                    <ul className="space-y-1">
                      <li>• HRA is a component of salary</li>
                      <li>• Exemption available under Section 10(13A)</li>
                      <li>• Must be actually living in rented accommodation</li>
                      <li>• Rent receipts required as proof</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      <li>• Valid rent agreement</li>
                      <li>• Rent receipts from landlord</li>
                      <li>• PAN of landlord if rent {">"} ₹1 lakh</li>
                      <li>• Proof of actual residence</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </FadeInSection>
      </main>

      <EnhancedFooter />
    </div>
  );
}