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
import { Calculator, TrendingUp, Info } from "lucide-react";

const taxSlabs = {
  "2024-25": [
    { min: 0, max: 300000, rate: 0, description: "Up to ₹3,00,000" },
    { min: 300000, max: 600000, rate: 5, description: "₹3,00,001 - ₹6,00,000" },
    { min: 600000, max: 900000, rate: 10, description: "₹6,00,001 - ₹9,00,000" },
    { min: 900000, max: 1200000, rate: 15, description: "₹9,00,001 - ₹12,00,000" },
    { min: 1200000, max: 1500000, rate: 20, description: "₹12,00,001 - ₹15,00,000" },
    { min: 1500000, max: Infinity, rate: 30, description: "Above ₹15,00,000" }
  ],
  "2023-24": [
    { min: 0, max: 250000, rate: 0, description: "Up to ₹2,50,000" },
    { min: 250000, max: 500000, rate: 5, description: "₹2,50,001 - ₹5,00,000" },
    { min: 500000, max: 1000000, rate: 20, description: "₹5,00,001 - ₹10,00,000" },
    { min: 1000000, max: Infinity, rate: 30, description: "Above ₹10,00,000" }
  ]
};

export default function IncomeTaxCalculatorPage() {
  const [formData, setFormData] = useState({
    annualIncome: "",
    age: "",
    financialYear: "2024-25",
    deductions: {
      standardDeduction: 50000,
      hra: "",
      lta: "",
      medicalInsurance: "",
      nps: "",
      elss: "",
      ppf: "",
      otherDeductions: ""
    }
  });

  const [results, setResults] = useState<{
    grossIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    taxBreakdown: Array<{
      min: number;
      max: number;
      rate: number;
      description: string;
      taxableAmount: number;
      taxAmount: number;
    }>;
    taxBeforeCess: number;
    cess: number;
    finalTax: number;
    effectiveTaxRate: number;
    takeHomeIncome: number;
  } | null>(null);

  const calculateTax = () => {
    const income = parseFloat(formData.annualIncome) || 0;
    const age = parseInt(formData.age) || 0;
    const year = formData.financialYear;
    
    // Calculate total deductions
    const totalDeductions = Object.values(formData.deductions).reduce((sum, val) => {
      return sum + (parseFloat(val.toString()) || 0);
    }, 0);

    // Calculate taxable income
    const taxableIncome = Math.max(0, income - totalDeductions);

    // Get tax slabs for the selected year
    const slabs = taxSlabs[year];
    let totalTax = 0;
    let remainingIncome = taxableIncome;
    const taxBreakdown = [];

    for (const slab of slabs) {
      if (remainingIncome <= 0) break;
      
      const taxableInSlab = Math.min(remainingIncome, slab.max - slab.min);
      const taxInSlab = (taxableInSlab * slab.rate) / 100;
      
      if (taxableInSlab > 0) {
        taxBreakdown.push({
          ...slab,
          taxableAmount: taxableInSlab,
          taxAmount: taxInSlab
        });
        totalTax += taxInSlab;
        remainingIncome -= taxableInSlab;
      }
    }

    // Add cess (4% of total tax)
    const cess = (totalTax * 4) / 100;
    const finalTax = totalTax + cess;

    // Calculate effective tax rate
    const effectiveTaxRate = income > 0 ? (finalTax / income) * 100 : 0;

    setResults({
      grossIncome: income,
      totalDeductions,
      taxableIncome,
      taxBreakdown,
      taxBeforeCess: totalTax,
      cess,
      finalTax,
      effectiveTaxRate,
      takeHomeIncome: income - finalTax
    });
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <EnhancedHeader />
      
      <main className="pt-20">
        <FadeInSection className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Income Tax Calculator
                </h1>
                <p className="text-xl text-gray-600">
                  Calculate your income tax liability for FY 2024-25 and plan your taxes efficiently
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Tax Calculation Details
                    </CardTitle>
                    <CardDescription>
                      Enter your income and deduction details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Basic Information</h3>
                      
                      <div>
                        <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                        <Input
                          id="annualIncome"
                          type="number"
                          placeholder="Enter your annual income"
                          value={formData.annualIncome}
                          onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Select value={formData.age} onValueChange={(value) => handleInputChange('age', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your age group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="below-60">Below 60 years</SelectItem>
                            <SelectItem value="60-80">60-80 years</SelectItem>
                            <SelectItem value="above-80">Above 80 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="financialYear">Financial Year</Label>
                        <Select value={formData.financialYear} onValueChange={(value) => handleInputChange('financialYear', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024-25">2024-25</SelectItem>
                            <SelectItem value="2023-24">2023-24</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Deductions</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hra">HRA (₹)</Label>
                          <Input
                            id="hra"
                            type="number"
                            placeholder="0"
                            value={formData.deductions.hra}
                            onChange={(e) => handleInputChange('deductions.hra', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lta">LTA (₹)</Label>
                          <Input
                            id="lta"
                            type="number"
                            placeholder="0"
                            value={formData.deductions.lta}
                            onChange={(e) => handleInputChange('deductions.lta', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="medicalInsurance">Medical Insurance (₹)</Label>
                          <Input
                            id="medicalInsurance"
                            type="number"
                            placeholder="0"
                            value={formData.deductions.medicalInsurance}
                            onChange={(e) => handleInputChange('deductions.medicalInsurance', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="nps">NPS (₹)</Label>
                          <Input
                            id="nps"
                            type="number"
                            placeholder="0"
                            value={formData.deductions.nps}
                            onChange={(e) => handleInputChange('deductions.nps', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="elss">ELSS (₹)</Label>
                          <Input
                            id="elss"
                            type="number"
                            placeholder="0"
                            value={formData.deductions.elss}
                            onChange={(e) => handleInputChange('deductions.elss', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ppf">PPF (₹)</Label>
                          <Input
                            id="ppf"
                            type="number"
                            placeholder="0"
                            value={formData.deductions.ppf}
                            onChange={(e) => handleInputChange('deductions.ppf', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="otherDeductions">Other Deductions (₹)</Label>
                        <Input
                          id="otherDeductions"
                          type="number"
                          placeholder="0"
                          value={formData.deductions.otherDeductions}
                          onChange={(e) => handleInputChange('deductions.otherDeductions', e.target.value)}
                        />
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-semibold">Standard Deduction: ₹50,000</p>
                            <p>Automatically applied to salaried individuals</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button onClick={calculateTax} className="w-full">
                      Calculate Tax
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
                            Tax Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Gross Income</p>
                              <p className="font-semibold">₹{results.grossIncome.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Deductions</p>
                              <p className="font-semibold">₹{results.totalDeductions.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Taxable Income</p>
                              <p className="font-semibold">₹{results.taxableIncome.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tax Before Cess</p>
                              <p className="font-semibold">₹{results.taxBeforeCess.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Cess (4%)</p>
                              <p className="font-semibold">₹{results.cess.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Final Tax</p>
                              <p className="font-semibold text-red-600">₹{results.finalTax.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold">Take Home Income</span>
                              <span className="text-lg font-bold text-green-600">
                                ₹{results.takeHomeIncome.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600">
                              <span>Effective Tax Rate</span>
                              <span>{results.effectiveTaxRate.toFixed(2)}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Tax Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {results.taxBreakdown.map((slab, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <div>
                                  <p className="font-medium">{slab.description}</p>
                                  <p className="text-gray-600">₹{slab.taxableAmount.toLocaleString()} @ {slab.rate}%</p>
                                </div>
                                <p className="font-semibold">₹{slab.taxAmount.toLocaleString()}</p>
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
                        <p className="text-gray-600">Enter your details and click "Calculate Tax" to see results</p>
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
