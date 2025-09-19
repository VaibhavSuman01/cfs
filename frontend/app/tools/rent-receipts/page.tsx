"use client";

import { useState } from "react";
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download, Printer, FileText } from "lucide-react";

interface RentReceiptData {
  tenantName: string;
  landlordName: string;
  propertyAddress: string;
  rentAmount: number;
  rentPeriod: string;
  paymentDate: string;
  paymentMode: string;
  receiptNumber: string;
}

export default function GenerateRentReceipts() {
  const [formData, setFormData] = useState({
    tenantName: "",
    landlordName: "",
    propertyAddress: "",
    rentAmount: 0,
    rentPeriod: "",
    paymentDate: "",
    paymentMode: "cash",
  });

  const [receiptData, setReceiptData] = useState<RentReceiptData | null>(null);

  const generateReceipt = () => {
    if (!formData.tenantName || !formData.landlordName || !formData.propertyAddress || 
        !formData.rentAmount || !formData.rentPeriod || !formData.paymentDate) {
      return;
    }

    const receiptNumber = `RR${Date.now().toString().slice(-6)}`;
    
    setReceiptData({
      tenantName: formData.tenantName,
      landlordName: formData.landlordName,
      propertyAddress: formData.propertyAddress,
      rentAmount: formData.rentAmount,
      rentPeriod: formData.rentPeriod,
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      receiptNumber: receiptNumber
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadReceipt = () => {
    if (!receiptData) return;

    const receiptContent = `
RENT RECEIPT

Receipt No: ${receiptData.receiptNumber}
Date: ${formatDate(receiptData.paymentDate)}

Received from: ${receiptData.tenantName}
Property Address: ${receiptData.propertyAddress}
Rent Period: ${receiptData.rentPeriod}
Amount: ${formatCurrency(receiptData.rentAmount)}
Payment Mode: ${receiptData.paymentMode.toUpperCase()}

Received by: ${receiptData.landlordName}

This is to certify that the above amount has been received as rent for the property mentioned above.

Signature: _________________
Date: ${formatDate(receiptData.paymentDate)}
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rent-receipt-${receiptData.receiptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReceipt = () => {
    if (!receiptData) return;
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-teal-100 rounded-full">
                  <Receipt className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Generate Rent Receipts</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create professional rent receipts for your rental payments with our easy-to-use generator.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Receipt Details
                  </CardTitle>
                  <CardDescription>
                    Enter the details to generate your rent receipt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tenant Name */}
                  <div className="space-y-2">
                    <Label htmlFor="tenantName">Tenant Name</Label>
                    <Input
                      id="tenantName"
                      type="text"
                      value={formData.tenantName}
                      onChange={(e) => handleInputChange("tenantName", e.target.value)}
                      placeholder="Enter tenant name"
                    />
                  </div>

                  {/* Landlord Name */}
                  <div className="space-y-2">
                    <Label htmlFor="landlordName">Landlord Name</Label>
                    <Input
                      id="landlordName"
                      type="text"
                      value={formData.landlordName}
                      onChange={(e) => handleInputChange("landlordName", e.target.value)}
                      placeholder="Enter landlord name"
                    />
                  </div>

                  {/* Property Address */}
                  <div className="space-y-2">
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <Input
                      id="propertyAddress"
                      type="text"
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                      placeholder="Enter property address"
                    />
                  </div>

                  {/* Rent Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="rentAmount">Rent Amount (₹)</Label>
                    <Input
                      id="rentAmount"
                      type="number"
                      value={formData.rentAmount}
                      onChange={(e) => handleInputChange("rentAmount", parseInt(e.target.value) || 0)}
                      placeholder="Enter rent amount"
                    />
                  </div>

                  {/* Rent Period */}
                  <div className="space-y-2">
                    <Label htmlFor="rentPeriod">Rent Period</Label>
                    <Input
                      id="rentPeriod"
                      type="text"
                      value={formData.rentPeriod}
                      onChange={(e) => handleInputChange("rentPeriod", e.target.value)}
                      placeholder="e.g., January 2024"
                    />
                  </div>

                  {/* Payment Date */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                    />
                  </div>

                  {/* Payment Mode */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <Select value={formData.paymentMode} onValueChange={(value) => handleInputChange("paymentMode", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="neft">NEFT</SelectItem>
                        <SelectItem value="rtgs">RTGS</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={generateReceipt} className="w-full bg-teal-600 hover:bg-teal-700">
                    <Receipt className="w-4 h-4 mr-2" />
                    Generate Receipt
                  </Button>
                </CardContent>
              </Card>

              {/* Receipt Preview */}
              <div className="space-y-6">
                {receiptData ? (
                  <>
                    {/* Receipt Actions */}
                    <Card className="bg-teal-50 border-teal-200">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Button onClick={downloadReceipt} className="flex-1 bg-teal-600 hover:bg-teal-700">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button onClick={printReceipt} variant="outline" className="flex-1">
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Receipt Preview */}
                    <Card className="print:shadow-none print:border-0">
                      <CardContent className="p-8">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">RENT RECEIPT</h2>
                          <div className="w-16 h-0.5 bg-gray-400 mx-auto"></div>
                        </div>

                        <div className="space-y-4 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold">Receipt No:</span>
                            <span>{receiptData.receiptNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Date:</span>
                            <span>{formatDate(receiptData.paymentDate)}</span>
                          </div>
                          
                          <div className="border-t pt-4 mt-4">
                            <div className="space-y-3">
                              <div>
                                <span className="font-semibold">Received from:</span>
                                <p className="mt-1">{receiptData.tenantName}</p>
                              </div>
                              <div>
                                <span className="font-semibold">Property Address:</span>
                                <p className="mt-1">{receiptData.propertyAddress}</p>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">Rent Period:</span>
                                <span>{receiptData.rentPeriod}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">Amount:</span>
                                <span className="text-lg font-bold">{formatCurrency(receiptData.rentAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">Payment Mode:</span>
                                <span className="uppercase">{receiptData.paymentMode}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-4 mt-6">
                            <p className="text-center text-sm text-gray-600 mb-4">
                              This is to certify that the above amount has been received as rent for the property mentioned above.
                            </p>
                            
                            <div className="flex justify-between mt-8">
                              <div>
                                <p className="font-semibold">Received by:</p>
                                <p className="mt-8">{receiptData.landlordName}</p>
                                <div className="w-32 h-0.5 bg-gray-400 mt-2"></div>
                                <p className="text-xs text-gray-500">Signature</p>
                              </div>
                              <div>
                                <p className="font-semibold">Date:</p>
                                <p className="mt-8">{formatDate(receiptData.paymentDate)}</p>
                                <div className="w-32 h-0.5 bg-gray-400 mt-2"></div>
                                <p className="text-xs text-gray-500">Date</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Fill in the details and click "Generate Receipt" to see preview</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Rent Receipt Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About Rent Receipts</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Why You Need Rent Receipts:</h4>
                    <ul className="space-y-1">
                      <li>• Proof of rent payment</li>
                      <li>• Required for HRA tax benefits</li>
                      <li>• Legal documentation</li>
                      <li>• Record keeping</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Important Points:</h4>
                    <ul className="space-y-1">
                      <li>• Keep receipts for at least 6 years</li>
                      <li>• Include all required details</li>
                      <li>• Get landlord's signature</li>
                      <li>• Maintain proper records</li>
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
