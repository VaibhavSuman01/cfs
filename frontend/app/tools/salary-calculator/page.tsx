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
import { Calculator, TrendingUp, PieChart, Info } from "lucide-react";

export default function SalaryCalculatorPage() {
  const [formData, setFormData] = useState({
    basicSalary: "",
    hra: "",
    specialAllowance: "",
    medicalAllowance: "",
    transportAllowance: "",
    otherAllowances: "",
    pf: "",
    esi: "",
    professionalTax: "",
    tds: "",
    otherDeductions: "",
    cityType: "metro"
  });

  const [results, setResults] = useState<{
    grossSalary: number;
    hraExemption: number;
    taxableHra: number;
    taxableSalary: number;
    standardDeduction: number;
    taxableIncome: number;
    incomeTax: number;
    cess: number;
    totalTax: number;
    deductions: {
      pf: number;
      esi: number;
      professionalTax: number;
      tds: number;
      otherDeductions: number;
      total: number;
    };
    netSalary: number;
    effectiveTaxRate: number;
  } | null>(null);

  const calculateSalary = () => {
    const basicSalary = parseFloat(formData.basicSalary) || 0;
    const hra = parseFloat(formData.hra) || 0;
    const specialAllowance = parseFloat(formData.specialAllowance) || 0;
    const medicalAllowance = parseFloat(formData.medicalAllowance) || 0;
    const transportAllowance = parseFloat(formData.transportAllowance) || 0;
    const otherAllowances = parseFloat(formData.otherAllowances) || 0;

    // Calculate gross salary
    const grossSalary = basicSalary + hra + specialAllowance + medicalAllowance + transportAllowance + otherAllowances;

    // Calculate HRA exemption
    const hraExemption = Math.min(
      hra,
      basicSalary * 0.5, // 50% of basic for metro, 40% for non-metro
      formData.cityType === "metro" ? basicSalary * 0.5 : basicSalary * 0.4
    );

    // Calculate taxable HRA
    const taxableHra = hra - hraExemption;

    // Calculate taxable salary
    const taxableSalary = grossSalary - hraExemption;

    // Calculate standard deduction
    const standardDeduction = 50000;

    // Calculate taxable income after standard deduction
    const taxableIncome = Math.max(0, taxableSalary - standardDeduction);

    // Calculate income tax using progressive tax slabs (New Regime 2024-25)
    let incomeTax = 0;
    let remainingIncome = taxableIncome;
    
    // Tax slabs for FY 2024-25 (New Regime)
    if (remainingIncome > 1500000) {
      incomeTax += (remainingIncome - 1500000) * 0.30;
      remainingIncome = 1500000;
    }
    if (remainingIncome > 1200000) {
      incomeTax += (remainingIncome - 1200000) * 0.20;
      remainingIncome = 1200000;
    }
    if (remainingIncome > 900000) {
      incomeTax += (remainingIncome - 900000) * 0.15;
      remainingIncome = 900000;
    }
    if (remainingIncome > 600000) {
      incomeTax += (remainingIncome - 600000) * 0.10;
      remainingIncome = 600000;
    }
    if (remainingIncome > 300000) {
      incomeTax += (remainingIncome - 300000) * 0.05;
      remainingIncome = 300000;
    }
    // No tax for income up to ₹3,00,000

    // Add cess (4% of income tax)
    const cess = incomeTax * 0.04;
    const totalTax = incomeTax + cess;

    // Calculate deductions (Indian standards)
    // EPF: 12% of basic salary (both employee and employer contribute, but only employee's share is deducted)
    const pf = parseFloat(formData.pf) || (basicSalary * 0.12);
    
    // ESI: 0.75% of gross salary (only if gross salary <= ₹21,000)
    const esi = grossSalary <= 21000 ? (parseFloat(formData.esi) || (grossSalary * 0.0075)) : 0;
    
    // Professional Tax: Varies by state, default ₹200/month (₹2,400/year)
    const professionalTax = parseFloat(formData.professionalTax) || 200;
    
    // TDS: Tax deducted at source (monthly tax)
    const tds = parseFloat(formData.tds) || (totalTax / 12);
    
    const otherDeductions = parseFloat(formData.otherDeductions) || 0;

    const totalDeductions = pf + esi + professionalTax + tds + otherDeductions;

    // Calculate net salary
    const netSalary = grossSalary - totalDeductions;

    // Calculate effective tax rate
    const effectiveTaxRate = grossSalary > 0 ? (totalTax / grossSalary) * 100 : 0;

    setResults({
      grossSalary,
      hraExemption,
      taxableHra,
      taxableSalary,
      standardDeduction,
      taxableIncome,
      incomeTax,
      cess,
      totalTax,
      deductions: {
        pf,
        esi,
        professionalTax,
        tds,
        otherDeductions,
        total: totalDeductions
      },
      netSalary,
      effectiveTaxRate
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <EnhancedHeader />
      
      <main className="pt-20">
        <FadeInSection className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Salary Calculator
                </h1>
                <p className="text-xl text-gray-600">
                  Calculate your take-home salary with accurate tax calculations
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Salary Details
                    </CardTitle>
                    <CardDescription>
                      Enter your salary components and deductions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Salary Components</h3>
                      
                      <div>
                        <Label htmlFor="basicSalary">Basic Salary (₹)</Label>
                        <Input
                          id="basicSalary"
                          type="number"
                          placeholder="Enter basic salary"
                          value={formData.basicSalary}
                          onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="hra">HRA (₹)</Label>
                        <Input
                          id="hra"
                          type="number"
                          placeholder="Enter HRA"
                          value={formData.hra}
                          onChange={(e) => handleInputChange('hra', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="specialAllowance">Special Allowance (₹)</Label>
                        <Input
                          id="specialAllowance"
                          type="number"
                          placeholder="Enter special allowance"
                          value={formData.specialAllowance}
                          onChange={(e) => handleInputChange('specialAllowance', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="medicalAllowance">Medical Allowance (₹)</Label>
                        <Input
                          id="medicalAllowance"
                          type="number"
                          placeholder="Enter medical allowance"
                          value={formData.medicalAllowance}
                          onChange={(e) => handleInputChange('medicalAllowance', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="transportAllowance">Transport Allowance (₹)</Label>
                        <Input
                          id="transportAllowance"
                          type="number"
                          placeholder="Enter transport allowance"
                          value={formData.transportAllowance}
                          onChange={(e) => handleInputChange('transportAllowance', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="otherAllowances">Other Allowances (₹)</Label>
                        <Input
                          id="otherAllowances"
                          type="number"
                          placeholder="Enter other allowances"
                          value={formData.otherAllowances}
                          onChange={(e) => handleInputChange('otherAllowances', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Deductions</h3>
                      
                      <div>
                        <Label htmlFor="cityType">City Type</Label>
                        <Select value={formData.cityType} onValueChange={(value) => handleInputChange('cityType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="metro">Metro City</SelectItem>
                            <SelectItem value="non-metro">Non-Metro City</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="pf">PF (₹)</Label>
                        <Input
                          id="pf"
                          type="number"
                          placeholder="Enter PF amount (auto-calculated if empty)"
                          value={formData.pf}
                          onChange={(e) => handleInputChange('pf', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="esi">ESI (₹)</Label>
                        <Input
                          id="esi"
                          type="number"
                          placeholder="Enter ESI amount (auto-calculated if empty)"
                          value={formData.esi}
                          onChange={(e) => handleInputChange('esi', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="professionalTax">Professional Tax (₹)</Label>
                        <Input
                          id="professionalTax"
                          type="number"
                          placeholder="Enter professional tax"
                          value={formData.professionalTax}
                          onChange={(e) => handleInputChange('professionalTax', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="otherDeductions">Other Deductions (₹)</Label>
                        <Input
                          id="otherDeductions"
                          type="number"
                          placeholder="Enter other deductions"
                          value={formData.otherDeductions}
                          onChange={(e) => handleInputChange('otherDeductions', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold">Note</p>
                          <p>PF and ESI are auto-calculated if not provided. TDS is calculated based on income tax.</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={calculateSalary} className="w-full">
                      Calculate Salary
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
                            Salary Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Take Home Salary</p>
                            <p className="text-3xl font-bold text-orange-600">
                              ₹{results.netSalary.toLocaleString()}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Gross Salary</p>
                              <p className="font-semibold">₹{results.grossSalary.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Deductions</p>
                              <p className="font-semibold">₹{results.deductions.total.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Taxable Income</p>
                              <p className="font-semibold">₹{results.taxableIncome.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Tax</p>
                              <p className="font-semibold text-red-600">₹{results.totalTax.toLocaleString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5" />
                            Deduction Breakdown
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Provident Fund (PF)</span>
                              <span className="font-semibold">₹{results.deductions.pf.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">ESI</span>
                              <span className="font-semibold">₹{results.deductions.esi.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Professional Tax</span>
                              <span className="font-semibold">₹{results.deductions.professionalTax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">TDS</span>
                              <span className="font-semibold">₹{results.deductions.tds.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Other Deductions</span>
                              <span className="font-semibold">₹{results.deductions.otherDeductions.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <div className="flex justify-between items-center font-semibold">
                              <span>Total Deductions</span>
                              <span>₹{results.deductions.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Tax Calculation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Gross Salary:</span>
                              <span>₹{results.grossSalary.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>HRA Exemption:</span>
                              <span className="text-green-600">-₹{results.hraExemption.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Standard Deduction:</span>
                              <span className="text-green-600">-₹{results.standardDeduction.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Taxable Income:</span>
                              <span>₹{results.taxableIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Income Tax:</span>
                              <span>₹{results.incomeTax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Cess (4%):</span>
                              <span>₹{results.cess.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2 text-red-600">
                              <span>Total Tax:</span>
                              <span>₹{results.totalTax.toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {!results && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Enter your salary details and click "Calculate Salary" to see results</p>
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
