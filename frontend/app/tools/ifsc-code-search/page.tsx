"use client";

import { useState } from "react";
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, MapPin, Phone, CheckCircle, XCircle } from "lucide-react";

interface IFSCSearchResults {
  ifscCode: string;
  bankName: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  micrCode: string;
  isValid: boolean;
}

export default function IFSCCodeSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IFSCSearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateIFSCCode = (ifscCode: string): boolean => {
    // IFSC code format: 4 characters bank code + 0 + 6 characters branch code
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifscCode);
  };

  const searchIFSCCode = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter an IFSC code");
      return;
    }

    const ifscCode = searchTerm.trim().toUpperCase();
    
    if (!validateIFSCCode(ifscCode)) {
      setError("Invalid IFSC code format. Please enter a valid 11-character IFSC code.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      // Simulate API call - in real implementation, this would call the actual IFSC API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data for demonstration
      const mockResults: IFSCSearchResults = {
        ifscCode: ifscCode,
        bankName: "State Bank of India",
        branchName: "Gurgaon Main Branch",
        address: "SCO 1, Sector 14, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        pincode: "122001",
        phone: "0124-1234567",
        micrCode: "110002001",
        isValid: true
      };

      setResults(mockResults);
    } catch (err) {
      setError("Failed to fetch IFSC details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setError("");
    setResults(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchIFSCCode();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Search className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">IFSC Code Search</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Search and verify IFSC codes to get bank branch information and details.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Search Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    IFSC Code Search
                  </CardTitle>
                  <CardDescription>
                    Enter an 11-character IFSC code to search for bank branch details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      type="text"
                      value={searchTerm}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter 11-character IFSC code"
                      className="uppercase"
                      maxLength={11}
                    />
                    <p className="text-xs text-gray-500">
                      Format: 4 characters bank code + 0 + 6 characters branch code
                    </p>
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
                    onClick={searchIFSCCode} 
                    disabled={isLoading || !searchTerm.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search IFSC Code
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    {/* Status Card */}
                    <Card className={results.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {results.isValid ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                          <span className="text-lg font-semibold">
                            {results.isValid ? "Valid IFSC Code" : "Invalid IFSC Code"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {results.ifscCode}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bank Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Bank Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">IFSC Code</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold font-mono">{results.ifscCode}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(results.ifscCode)}
                                className="h-6 px-2 text-xs"
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bank Name</span>
                            <span className="font-semibold">{results.bankName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Branch Name</span>
                            <span className="font-semibold">{results.branchName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">MICR Code</span>
                            <span className="font-semibold font-mono">{results.micrCode}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Address Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Address Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="text-gray-600">Address</span>
                            <span className="font-semibold text-right max-w-xs">{results.address}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">City</span>
                            <span className="font-semibold">{results.city}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">State</span>
                            <span className="font-semibold">{results.state}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Pincode</span>
                            <span className="font-semibold">{results.pincode}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contact Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Phone className="w-5 h-5" />
                          Contact Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Phone</span>
                            <span className="font-semibold">{results.phone}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Branch Code</span>
                            <span className="font-semibold font-mono">{results.ifscCode.slice(4)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter an IFSC code and click "Search IFSC Code" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* IFSC Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About IFSC Code Search</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">IFSC Code Format:</h4>
                    <ul className="space-y-1">
                      <li>• 4 characters: Bank code</li>
                      <li>• 1 character: 0 (fixed)</li>
                      <li>• 6 characters: Branch code</li>
                      <li>• Total: 11 characters</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What You Can Find:</h4>
                    <ul className="space-y-1">
                      <li>• Bank name and branch</li>
                      <li>• Complete address</li>
                      <li>• Contact information</li>
                      <li>• MICR code</li>
                      <li>• Branch code details</li>
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
