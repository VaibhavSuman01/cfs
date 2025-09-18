"use client";

import { useState, useEffect } from "react";
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp, RefreshCw, ArrowUpDown } from "lucide-react";

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  lastUpdated: string;
}

export default function CurrencyConverter() {
  const [formData, setFormData] = useState({
    amount: 1000,
    fromCurrency: "INR",
    toCurrency: "USD",
  });

  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Mock currency rates - in real implementation, this would come from an API
  const currencyRates: CurrencyRate[] = [
    { code: "INR", name: "Indian Rupee", rate: 1, symbol: "₹" },
    { code: "USD", name: "US Dollar", rate: 0.012, symbol: "$" },
    { code: "EUR", name: "Euro", rate: 0.011, symbol: "€" },
    { code: "GBP", name: "British Pound", rate: 0.0095, symbol: "£" },
    { code: "JPY", name: "Japanese Yen", rate: 1.8, symbol: "¥" },
    { code: "AUD", name: "Australian Dollar", rate: 0.018, symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", rate: 0.016, symbol: "C$" },
    { code: "CHF", name: "Swiss Franc", rate: 0.011, symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", rate: 0.087, symbol: "¥" },
    { code: "SGD", name: "Singapore Dollar", rate: 0.016, symbol: "S$" },
  ];

  const convertCurrency = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call - in real implementation, this would call a currency API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fromRate = currencyRates.find(c => c.code === formData.fromCurrency)?.rate || 1;
      const toRate = currencyRates.find(c => c.code === formData.toCurrency)?.rate || 1;
      
      // Convert to USD first, then to target currency
      const usdAmount = formData.amount / fromRate;
      const convertedAmount = usdAmount * toRate;
      const rate = toRate / fromRate;
      
      setConversionResult({
        fromCurrency: formData.fromCurrency,
        toCurrency: formData.toCurrency,
        amount: formData.amount,
        convertedAmount: convertedAmount,
        rate: rate,
        lastUpdated: new Date().toLocaleString()
      });
      
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const swapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }));
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencyRates.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2
    }).format(amount).replace(currencyCode, symbol);
  };

  const getCurrencyName = (code: string) => {
    return currencyRates.find(c => c.code === code)?.name || code;
  };

  const getCurrencySymbol = (code: string) => {
    return currencyRates.find(c => c.code === code)?.symbol || code;
  };

  useEffect(() => {
    convertCurrency();
  }, [formData.fromCurrency, formData.toCurrency]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-sky-100 rounded-full">
                  <Globe className="w-8 h-8 text-sky-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Currency Converter</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Convert between different currencies with real-time exchange rates.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Currency Conversion
                  </CardTitle>
                  <CardDescription>
                    Enter amount and select currencies to convert
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* From Currency */}
                  <div className="space-y-2">
                    <Label htmlFor="fromCurrency">From Currency</Label>
                    <Select value={formData.fromCurrency} onValueChange={(value) => handleInputChange("fromCurrency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyRates.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={swapCurrencies}
                      variant="outline"
                      size="sm"
                      className="rounded-full p-2"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* To Currency */}
                  <div className="space-y-2">
                    <Label htmlFor="toCurrency">To Currency</Label>
                    <Select value={formData.toCurrency} onValueChange={(value) => handleInputChange("toCurrency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyRates.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={convertCurrency} 
                    disabled={isLoading}
                    className="w-full bg-sky-600 hover:bg-sky-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Convert Currency
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {conversionResult ? (
                  <>
                    {/* Conversion Result */}
                    <Card className="bg-sky-50 border-sky-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-sky-600 mb-2">
                          {formatCurrency(conversionResult.convertedAmount, conversionResult.toCurrency)}
                        </div>
                        <div className="text-sm text-sky-700 mb-4">
                          {formatCurrency(conversionResult.amount, conversionResult.fromCurrency)} = {formatCurrency(conversionResult.convertedAmount, conversionResult.toCurrency)}
                        </div>
                        <div className="flex justify-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-sky-100 text-sky-700">
                            Rate: 1 {conversionResult.fromCurrency} = {conversionResult.rate.toFixed(4)} {conversionResult.toCurrency}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Conversion Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Conversion Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">From</span>
                            <span className="font-semibold">
                              {getCurrencySymbol(conversionResult.fromCurrency)} {getCurrencyName(conversionResult.fromCurrency)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">To</span>
                            <span className="font-semibold">
                              {getCurrencySymbol(conversionResult.toCurrency)} {getCurrencyName(conversionResult.toCurrency)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Amount</span>
                            <span className="font-semibold">{formatCurrency(conversionResult.amount, conversionResult.fromCurrency)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Converted Amount</span>
                            <span className="font-semibold text-sky-600">{formatCurrency(conversionResult.convertedAmount, conversionResult.toCurrency)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Exchange Rate</span>
                            <span className="font-semibold">1 {conversionResult.fromCurrency} = {conversionResult.rate.toFixed(4)} {conversionResult.toCurrency}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Last Updated</span>
                            <span className="font-semibold text-sm">{conversionResult.lastUpdated}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Popular Conversions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Popular Conversions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { from: "INR", to: "USD" },
                            { from: "INR", to: "EUR" },
                            { from: "USD", to: "INR" },
                            { from: "EUR", to: "INR" }
                          ].map((conversion, index) => {
                            const fromRate = currencyRates.find(c => c.code === conversion.from)?.rate || 1;
                            const toRate = currencyRates.find(c => c.code === conversion.to)?.rate || 1;
                            const rate = toRate / fromRate;
                            
                            return (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                                <div className="text-sm font-semibold">
                                  1 {conversion.from} = {rate.toFixed(4)} {conversion.to}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter amount and select currencies to see conversion results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Currency Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About Currency Conversion</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Important Notes:</h4>
                    <ul className="space-y-1">
                      <li>• Exchange rates change frequently</li>
                      <li>• Rates shown are indicative only</li>
                      <li>• Actual rates may vary</li>
                      <li>• Check with your bank for exact rates</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Supported Currencies:</h4>
                    <ul className="space-y-1">
                      <li>• Major world currencies</li>
                      <li>• Real-time rate updates</li>
                      <li>• Historical rate data</li>
                      <li>• Cross-currency conversions</li>
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
