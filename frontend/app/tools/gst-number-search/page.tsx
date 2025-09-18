"use client";

import { useState } from "react";
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";

interface GSTSearchResults {
  gstNumber: string;
  businessName: string;
  address: string;
  state: string;
  pincode: string;
  registrationDate: string;
  status: string;
  businessType: string;
  isValid: boolean;
}

export default function GSTNumberSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<GSTSearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateGSTNumber = (gstNumber: string): boolean => {
    // GST number format: 2 digits state code + 10 characters PAN + 1 digit entity number + 1 character Z + 1 digit checksum
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  };

  const searchGSTNumber = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a GST number");
      return;
    }

    const gstNumber = searchTerm.trim().toUpperCase();
    
    if (!validateGSTNumber(gstNumber)) {
      setError("Invalid GST number format. Please enter a valid 15-character GST number.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      // Simulate API call - in real implementation, this would call the actual GST API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data for demonstration
      const mockResults: GSTSearchResults = {
        gstNumber: gstNumber,
        businessName: "ABC Private Limited",
        address: "123 Business Park, Sector 5, Gurgaon",
        state: "Haryana",
        pincode: "122001",
        registrationDate: "2020-01-15",
        status: "Active",
        businessType: "Private Limited Company",
        isValid: true
      };

      setResults(mockResults);
    } catch (err) {
      setError("Failed to fetch GST details. Please try again.");
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
      searchGSTNumber();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <Search className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">GST Number Search</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Search and verify GST numbers to get business information and registration details.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Search Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    GST Number Search
                  </CardTitle>
                  <CardDescription>
                    Enter a 15-character GST number to search for business details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      type="text"
                      value={searchTerm}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter 15-character GST number"
                      className="uppercase"
                      maxLength={15}
                    />
                    <p className="text-xs text-gray-500">
                      Format: 2 digits state code + 10 characters PAN + 1 digit entity number + 1 character Z + 1 digit checksum
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
                    onClick={searchGSTNumber} 
                    disabled={isLoading || !searchTerm.trim()}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search GST Number
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
                            {results.isValid ? "Valid GST Number" : "Invalid GST Number"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {results.gstNumber}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Business Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Business Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">GST Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{results.gstNumber}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(results.gstNumber)}
                                className="h-6 px-2 text-xs"
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Business Name</span>
                            <span className="font-semibold">{results.businessName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Business Type</span>
                            <span className="font-semibold">{results.businessType}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status</span>
                            <Badge variant={results.status === "Active" ? "default" : "secondary"}>
                              {results.status}
                            </Badge>
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

                    {/* Registration Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Registration Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Registration Date</span>
                            <span className="font-semibold">{results.registrationDate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">GST Number</span>
                            <span className="font-semibold font-mono">{results.gstNumber}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter a GST number and click "Search GST Number" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* GST Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About GST Number Search</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">GST Number Format:</h4>
                    <ul className="space-y-1">
                      <li>• 2 digits: State code</li>
                      <li>• 10 characters: PAN number</li>
                      <li>• 1 digit: Entity number</li>
                      <li>• 1 character: Z (fixed)</li>
                      <li>• 1 digit: Checksum</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What You Can Find:</h4>
                    <ul className="space-y-1">
                      <li>• Business name and type</li>
                      <li>• Registration address</li>
                      <li>• Registration date</li>
                      <li>• Current status</li>
                      <li>• State and pincode</li>
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
