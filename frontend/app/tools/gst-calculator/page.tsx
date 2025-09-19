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
import { Calculator, TrendingUp, Info, Receipt } from "lucide-react";

const gstRates = [
  { value: 0, label: "0% - Exempted" },
  { value: 5, label: "5% - Essential items" },
  { value: 12, label: "12% - Processed food, computers" },
  { value: 18, label: "18% - Most goods and services" },
  { value: 28, label: "28% - Luxury items, cars" }
];

export default function GSTCalculatorPage() {
  const [formData, setFormData] = useState({
    amount: "",
    gstRate: "18",
    calculationType: "exclusive", // exclusive or inclusive
    cgst: 0,
    sgst: 0,
    igst: 0
  });

  const [results, setResults] = useState<{
    baseAmount: number;
    gstAmount: number;
    totalAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    rate: number;
  } | null>(null);

  const calculateGST = () => {
    const amount = parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.gstRate) || 0;

    if (amount <= 0 || rate < 0) {
      setResults(null);
      return;
    }

    let baseAmount, gstAmount, totalAmount;

    if (formData.calculationType === "exclusive") {
      // GST is added to the amount
      baseAmount = amount;
      gstAmount = (amount * rate) / 100;
      totalAmount = baseAmount + gstAmount;
    } else {
      // GST is included in the amount
      totalAmount = amount;
      baseAmount = amount / (1 + rate / 100);
      gstAmount = totalAmount - baseAmount;
    }

    // Calculate CGST, SGST, and IGST
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const igst = gstAmount;

    setResults({
      baseAmount,
      gstAmount,
      totalAmount,
      cgst,
      sgst,
      igst,
      rate
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <EnhancedHeader />
      
      <main className="pt-20">
        <FadeInSection className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  GST Calculator
                </h1>
                <p className="text-xl text-gray-600">
                  Calculate GST on your products and services with ease
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      GST Calculation
                    </CardTitle>
                    <CardDescription>
                      Enter amount and GST rate to calculate tax
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="calculationType">Calculation Type</Label>
                      <Select value={formData.calculationType} onValueChange={(value) => handleInputChange('calculationType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exclusive">GST Exclusive (Add GST to amount)</SelectItem>
                          <SelectItem value="inclusive">GST Inclusive (GST included in amount)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="gstRate">GST Rate</Label>
                      <Select value={formData.gstRate} onValueChange={(value) => handleInputChange('gstRate', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gstRates.map((rate) => (
                            <SelectItem key={rate.value} value={rate.value.toString()}>
                              {rate.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold">GST Structure</p>
                          <p>• CGST: Central GST (50% of total GST)</p>
                          <p>• SGST: State GST (50% of total GST)</p>
                          <p>• IGST: Integrated GST (for inter-state transactions)</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={calculateGST} className="w-full">
                      Calculate GST
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
                            GST Calculation Results
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Total Amount (Including GST)</p>
                            <p className="text-3xl font-bold text-red-600">
                              ₹{results.totalAmount.toLocaleString()}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Base Amount</p>
                              <p className="font-semibold">₹{results.baseAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">GST Amount ({results.rate}%)</p>
                              <p className="font-semibold">₹{results.gstAmount.toLocaleString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Receipt className="w-5 h-5" />
                            GST Breakdown
                          </CardTitle>
                          <CardDescription>
                            Detailed GST components
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <div>
                                <p className="font-medium text-blue-900">CGST</p>
                                <p className="text-sm text-blue-700">Central GST</p>
                              </div>
                              <p className="font-semibold text-blue-900">
                                ₹{results.cgst.toLocaleString()}
                              </p>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <div>
                                <p className="font-medium text-green-900">SGST</p>
                                <p className="text-sm text-green-700">State GST</p>
                              </div>
                              <p className="font-semibold text-green-900">
                                ₹{results.sgst.toLocaleString()}
                              </p>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                              <div>
                                <p className="font-medium text-purple-900">IGST</p>
                                <p className="text-sm text-purple-700">Integrated GST</p>
                              </div>
                              <p className="font-semibold text-purple-900">
                                ₹{results.igst.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total GST</span>
                              <span className="font-bold text-red-600">
                                ₹{results.gstAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>GST Invoice Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Base Amount:</span>
                              <span>₹{results.baseAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>CGST ({results.rate/2}%):</span>
                              <span>₹{results.cgst.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>SGST ({results.rate/2}%):</span>
                              <span>₹{results.sgst.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Total Amount:</span>
                              <span>₹{results.totalAmount.toLocaleString()}</span>
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
                        <p className="text-gray-600">Enter amount and GST rate to see calculation results</p>
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
