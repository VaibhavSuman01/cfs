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
import { Search, Building2, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";

interface GSTSearchResult {
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

export default function GSTSearchByName() {
  const [formData, setFormData] = useState({
    businessName: "",
    state: "",
    businessType: "",
  });

  const [searchResults, setSearchResults] = useState<GSTSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchGSTByName = async () => {
    if (!formData.businessName.trim()) {
      setError("Please enter a business name to search");
      return;
    }

    setIsLoading(true);
    setError("");
    setSearchResults([]);

    try {
      // Simulate API call - in real implementation, this would call the actual GST API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data for demonstration
      const mockResults: GSTSearchResult[] = [
        {
          gstNumber: "07AABCU9603R1ZX",
          businessName: "ABC Private Limited",
          address: "123 Business Park, Sector 5, Gurgaon",
          state: "Haryana",
          pincode: "122001",
          registrationDate: "2020-01-15",
          status: "Active",
          businessType: "Private Limited Company",
          isValid: true
        },
        {
          gstNumber: "07AABCU9603R1ZY",
          businessName: "ABC Solutions Private Limited",
          address: "456 Tech Hub, Sector 10, Gurgaon",
          state: "Haryana",
          pincode: "122001",
          registrationDate: "2021-03-20",
          status: "Active",
          businessType: "Private Limited Company",
          isValid: true
        },
        {
          gstNumber: "07AABCU9603R1ZZ",
          businessName: "ABC Technologies LLP",
          address: "789 Innovation Center, Sector 15, Gurgaon",
          state: "Haryana",
          pincode: "122001",
          registrationDate: "2022-06-10",
          status: "Active",
          businessType: "Limited Liability Partnership",
          isValid: true
        }
      ];

      // Filter results based on search criteria
      let filteredResults = mockResults.filter(result => 
        result.businessName.toLowerCase().includes(formData.businessName.toLowerCase())
      );

      if (formData.state && formData.state !== "all") {
        filteredResults = filteredResults.filter(result => 
          result.state.toLowerCase().includes(formData.state.toLowerCase())
        );
      }

      if (formData.businessType && formData.businessType !== "all") {
        filteredResults = filteredResults.filter(result => 
          result.businessType.toLowerCase().includes(formData.businessType.toLowerCase())
        );
      }

      setSearchResults(filteredResults);
    } catch (err) {
      setError("Failed to fetch GST details. Please try again.");
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
    setSearchResults([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Search className="w-8 h-8 text-purple-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">GST Search by Name</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Search for GST numbers by business name, state, or business type.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Search Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Criteria
                  </CardTitle>
                  <CardDescription>
                    Enter search criteria to find GST numbers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      placeholder="Enter business name"
                    />
                    <p className="text-xs text-gray-500">
                      Enter partial or complete business name
                    </p>
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="state">State (Optional)</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="mumbai">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="west bengal">West Bengal</SelectItem>
                        <SelectItem value="uttar pradesh">Uttar Pradesh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Business Type */}
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type (Optional)</Label>
                    <Select value={formData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="private limited">Private Limited Company</SelectItem>
                        <SelectItem value="public limited">Public Limited Company</SelectItem>
                        <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                        <SelectItem value="partnership">Partnership Firm</SelectItem>
                        <SelectItem value="sole proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="trust">Trust</SelectItem>
                        <SelectItem value="society">Society</SelectItem>
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
                    onClick={searchGSTByName} 
                    disabled={isLoading || !formData.businessName.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search GST Numbers
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Search Results */}
              <div className="lg:col-span-2 space-y-6">
                {searchResults.length > 0 ? (
                  <>
                    {/* Results Summary */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {searchResults.length}
                        </div>
                        <div className="text-sm text-purple-700">
                          {searchResults.length === 1 ? 'Result Found' : 'Results Found'}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Results List */}
                    <div className="space-y-4">
                      {searchResults.map((result, index) => (
                        <Card key={index} className="shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Building2 className="w-6 h-6 text-purple-600" />
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {result.businessName}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {result.businessType}
                                  </p>
                                </div>
                              </div>
                              <Badge className={result.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                {result.status}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-600">GST Number:</span>
                                  <span className="font-mono text-sm">{result.gstNumber}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(result.gstNumber)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    Copy
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">{result.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">State:</span>
                                  <span className="text-sm font-medium">{result.state}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Pincode:</span>
                                  <span className="text-sm font-medium">{result.pincode}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">Registration Date:</span>
                                  <span className="text-sm font-medium">{formatDate(result.registrationDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-gray-600">Status:</span>
                                  <span className="text-sm font-medium text-green-600">{result.status}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter a business name and click "Search GST Numbers" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* GST Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About GST Search by Name</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Search Features:</h4>
                    <ul className="space-y-1">
                      <li>• Search by business name</li>
                      <li>• Filter by state</li>
                      <li>• Filter by business type</li>
                      <li>• Get complete business details</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What You Can Find:</h4>
                    <ul className="space-y-1">
                      <li>• GST number and status</li>
                      <li>• Business name and type</li>
                      <li>• Complete address</li>
                      <li>• Registration date</li>
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
