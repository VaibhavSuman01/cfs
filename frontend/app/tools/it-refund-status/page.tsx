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
import { Search, FileText, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface RefundStatus {
  ackNumber: string;
  pan: string;
  assessmentYear: string;
  status: string;
  refundAmount: number;
  processedDate: string;
  refundDate: string;
  mode: string;
  remarks: string;
  isValid: boolean;
}

export default function ITRefundStatus() {
  const [formData, setFormData] = useState({
    ackNumber: "",
    pan: "",
    assessmentYear: "2024-25",
  });

  const [refundStatus, setRefundStatus] = useState<RefundStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePAN = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateAckNumber = (ackNumber: string): boolean => {
    // Acknowledgment number format validation
    const ackRegex = /^[0-9]{15}$/;
    return ackRegex.test(ackNumber);
  };

  const searchRefundStatus = async () => {
    if (!formData.ackNumber.trim() || !formData.pan.trim()) {
      setError("Please enter both Acknowledgment Number and PAN");
      return;
    }

    const pan = formData.pan.trim().toUpperCase();
    const ackNumber = formData.ackNumber.trim();

    if (!validatePAN(pan)) {
      setError("Invalid PAN format. Please enter a valid 10-character PAN.");
      return;
    }

    if (!validateAckNumber(ackNumber)) {
      setError("Invalid Acknowledgment Number format. Please enter a valid 15-digit number.");
      return;
    }

    setIsLoading(true);
    setError("");
    setRefundStatus(null);

    try {
      // Simulate API call - in real implementation, this would call the Income Tax Department API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data for demonstration
      const mockStatus: RefundStatus = {
        ackNumber: ackNumber,
        pan: pan,
        assessmentYear: formData.assessmentYear,
        status: "Processed",
        refundAmount: 25000,
        processedDate: "2024-01-15",
        refundDate: "2024-01-20",
        mode: "NEFT",
        remarks: "Refund processed successfully",
        isValid: true
      };

      setRefundStatus(mockStatus);
    } catch (err) {
      setError("Failed to fetch refund status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
    setRefundStatus(null);
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case "rejected":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">IT Refund Status</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Check your Income Tax refund status using your Acknowledgment Number and PAN.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Search Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Refund Status Search
                  </CardTitle>
                  <CardDescription>
                    Enter your details to check refund status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Acknowledgment Number */}
                  <div className="space-y-2">
                    <Label htmlFor="ackNumber">Acknowledgment Number</Label>
                    <Input
                      id="ackNumber"
                      type="text"
                      value={formData.ackNumber}
                      onChange={(e) => handleInputChange("ackNumber", e.target.value)}
                      placeholder="Enter 15-digit acknowledgment number"
                      maxLength={15}
                    />
                    <p className="text-xs text-gray-500">
                      15-digit number from your ITR acknowledgment
                    </p>
                  </div>

                  {/* PAN */}
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input
                      id="pan"
                      type="text"
                      value={formData.pan}
                      onChange={(e) => handleInputChange("pan", e.target.value.toUpperCase())}
                      placeholder="Enter 10-character PAN"
                      maxLength={10}
                      className="uppercase"
                    />
                    <p className="text-xs text-gray-500">
                      10-character PAN number (e.g., ABCDE1234F)
                    </p>
                  </div>

                  {/* Assessment Year */}
                  <div className="space-y-2">
                    <Label htmlFor="assessmentYear">Assessment Year</Label>
                    <Select value={formData.assessmentYear} onValueChange={(value) => handleInputChange("assessmentYear", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2022-23">2022-23</SelectItem>
                        <SelectItem value="2021-22">2021-22</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={searchRefundStatus} 
                    disabled={isLoading || !formData.ackNumber.trim() || !formData.pan.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Check Refund Status
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {refundStatus ? (
                  <>
                    {/* Status Card */}
                    <Card className={refundStatus.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          {getStatusIcon(refundStatus.status)}
                          <span className="text-xl font-semibold">
                            {refundStatus.status}
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-emerald-600 mb-2">
                          {formatCurrency(refundStatus.refundAmount)}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          Refund Amount
                        </div>
                        <Badge className={getStatusColor(refundStatus.status)}>
                          {refundStatus.status}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Refund Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Refund Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Acknowledgment Number</span>
                            <span className="font-semibold font-mono">{refundStatus.ackNumber}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">PAN Number</span>
                            <span className="font-semibold font-mono">{refundStatus.pan}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Assessment Year</span>
                            <span className="font-semibold">{refundStatus.assessmentYear}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status</span>
                            <Badge className={getStatusColor(refundStatus.status)}>
                              {refundStatus.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Refund Amount</span>
                            <span className="font-semibold text-emerald-600">{formatCurrency(refundStatus.refundAmount)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Processed Date</span>
                            <span className="font-semibold">{formatDate(refundStatus.processedDate)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Refund Date</span>
                            <span className="font-semibold">{formatDate(refundStatus.refundDate)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Mode</span>
                            <span className="font-semibold">{refundStatus.mode}</span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="text-gray-600">Remarks</span>
                            <span className="font-semibold text-right max-w-xs">{refundStatus.remarks}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your details and click "Check Refund Status" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Refund Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About IT Refund Status</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Refund Process:</h4>
                    <ul className="space-y-1">
                      <li>• File your ITR with correct bank details</li>
                      <li>• Refund is processed after verification</li>
                      <li>• Refund is credited to your bank account</li>
                      <li>• Check status using acknowledgment number</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Common Statuses:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Processed:</strong> Refund has been processed</li>
                      <li>• <strong>Pending:</strong> Refund is under process</li>
                      <li>• <strong>Rejected:</strong> Refund has been rejected</li>
                      <li>• <strong>No Refund:</strong> No refund due</li>
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
