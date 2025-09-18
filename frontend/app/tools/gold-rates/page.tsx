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
import { Coins, TrendingUp, TrendingDown, RefreshCw, Calendar } from "lucide-react";

interface GoldRate {
  type: string;
  purity: string;
  rate: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

interface GoldCalculation {
  weight: number;
  purity: string;
  rate: number;
  totalValue: number;
  makingCharges: number;
  gst: number;
  finalValue: number;
}

export default function GoldRatesToday() {
  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [calculation, setCalculation] = useState<GoldCalculation | null>(null);
  const [formData, setFormData] = useState({
    weight: 10,
    purity: "22K",
    makingCharges: 15,
    gstRate: 3,
  });

  const fetchGoldRates = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call - in real implementation, this would call a gold rates API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration
      const mockRates: GoldRate[] = [
        {
          type: "Gold",
          purity: "24K",
          rate: 6500,
          change: 50,
          changePercent: 0.78,
          lastUpdated: new Date().toLocaleString()
        },
        {
          type: "Gold",
          purity: "22K",
          rate: 5950,
          change: 45,
          changePercent: 0.76,
          lastUpdated: new Date().toLocaleString()
        },
        {
          type: "Gold",
          purity: "18K",
          rate: 4875,
          change: 37,
          changePercent: 0.76,
          lastUpdated: new Date().toLocaleString()
        },
        {
          type: "Gold",
          purity: "14K",
          rate: 3790,
          change: 29,
          changePercent: 0.77,
          lastUpdated: new Date().toLocaleString()
        },
        {
          type: "Silver",
          purity: "999",
          rate: 75,
          change: 2,
          changePercent: 2.74,
          lastUpdated: new Date().toLocaleString()
        }
      ];
      
      setGoldRates(mockRates);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Failed to fetch gold rates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateGoldValue = () => {
    const { weight, purity, makingCharges, gstRate } = formData;
    
    const selectedRate = goldRates.find(rate => rate.purity === purity);
    if (!selectedRate) return;
    
    const baseValue = weight * selectedRate.rate;
    const makingChargesAmount = (baseValue * makingCharges) / 100;
    const valueBeforeGST = baseValue + makingChargesAmount;
    const gstAmount = (valueBeforeGST * gstRate) / 100;
    const finalValue = valueBeforeGST + gstAmount;
    
    setCalculation({
      weight,
      purity,
      rate: selectedRate.rate,
      totalValue: baseValue,
      makingCharges: makingChargesAmount,
      gst: gstAmount,
      finalValue
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

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  useEffect(() => {
    fetchGoldRates();
  }, []);

  useEffect(() => {
    if (goldRates.length > 0) {
      calculateGoldValue();
    }
  }, [formData, goldRates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <EnhancedHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Coins className="w-8 h-8 text-yellow-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Gold Rates Today</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Check current gold and silver rates, calculate jewelry value, and track price changes.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Gold Rates */}
              <div className="lg:col-span-2 space-y-6">
                {/* Rate Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  {goldRates.map((rate, index) => (
                    <Card key={index} className="shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-yellow-600" />
                            <span className="font-semibold">{rate.purity} {rate.type}</span>
                          </div>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            {rate.type}
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {formatCurrency(rate.rate)}/gm
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {getChangeIcon(rate.change)}
                          <span className={getChangeColor(rate.change)}>
                            {rate.change >= 0 ? '+' : ''}{formatCurrency(rate.change)} ({rate.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Updated: {rate.lastUpdated}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Refresh Button */}
                <div className="flex justify-center">
                  <Button 
                    onClick={fetchGoldRates} 
                    disabled={isLoading}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Rates
                      </>
                    )}
                  </Button>
                </div>

                {/* Market Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Market Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-700 mb-1">24K Gold</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(goldRates.find(r => r.purity === "24K")?.rate || 0)}
                        </div>
                        <div className="text-xs text-green-600">per gram</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-700 mb-1">Silver</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(goldRates.find(r => r.purity === "999")?.rate || 0)}
                        </div>
                        <div className="text-xs text-blue-600">per gram</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gold Calculator */}
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Gold Calculator
                    </CardTitle>
                    <CardDescription>
                      Calculate the value of your gold jewelry
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Weight */}
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (grams)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)}
                        placeholder="Enter weight"
                      />
                    </div>

                    {/* Purity */}
                    <div className="space-y-2">
                      <Label htmlFor="purity">Purity</Label>
                      <Select value={formData.purity} onValueChange={(value) => handleInputChange("purity", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24K">24K (99.9%)</SelectItem>
                          <SelectItem value="22K">22K (91.6%)</SelectItem>
                          <SelectItem value="18K">18K (75%)</SelectItem>
                          <SelectItem value="14K">14K (58.3%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Making Charges */}
                    <div className="space-y-2">
                      <Label htmlFor="makingCharges">Making Charges (%)</Label>
                      <Input
                        id="makingCharges"
                        type="number"
                        value={formData.makingCharges}
                        onChange={(e) => handleInputChange("makingCharges", parseFloat(e.target.value) || 0)}
                        placeholder="Enter making charges"
                      />
                    </div>

                    {/* GST Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="gstRate">GST Rate (%)</Label>
                      <Input
                        id="gstRate"
                        type="number"
                        value={formData.gstRate}
                        onChange={(e) => handleInputChange("gstRate", parseFloat(e.target.value) || 0)}
                        placeholder="Enter GST rate"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Calculation Results */}
                {calculation && (
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-yellow-800">Calculation Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Base Value</span>
                          <span className="font-semibold">{formatCurrency(calculation.totalValue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Making Charges</span>
                          <span className="font-semibold">{formatCurrency(calculation.makingCharges)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">GST</span>
                          <span className="font-semibold">{formatCurrency(calculation.gst)}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Final Value</span>
                            <span className="text-xl font-bold text-yellow-600">{formatCurrency(calculation.finalValue)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Gold Information */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">About Gold Rates</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Gold Purity:</h4>
                    <ul className="space-y-1">
                      <li>• 24K: 99.9% pure gold</li>
                      <li>• 22K: 91.6% pure gold</li>
                      <li>• 18K: 75% pure gold</li>
                      <li>• 14K: 58.3% pure gold</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Factors Affecting Rates:</h4>
                    <ul className="space-y-1">
                      <li>• International gold prices</li>
                      <li>• Currency exchange rates</li>
                      <li>• Government policies</li>
                      <li>• Market demand and supply</li>
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
