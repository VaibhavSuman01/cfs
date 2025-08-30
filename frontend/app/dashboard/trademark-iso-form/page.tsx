"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FadeInSection } from "@/components/fade-in-section";
import { AnimatedBackground } from "@/components/animated-background";
import { FloatingElements } from "@/components/floating-elements";
import { CheckCircle, ArrowRight, Shield, Users, Building, Award, Upload, Plus, Trash2, FileText, Globe } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import api, { API_PATHS } from "@/lib/api-client";

const trademarkIsoFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pan: z.string().length(10, "PAN must be exactly 10 characters").toUpperCase(),
  service: z.string().min(1, "Service is required"),
  subService: z.string().min(1, "Sub-service is required"),
  
  // Business Details
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 digits"),
  gstin: z.string().optional(),
  
  // Trademark Specific Fields
  trademarkName: z.string().optional(),
  trademarkClass: z.string().optional(),
  trademarkDescription: z.string().optional(),
  existingTrademarks: z.string().optional(),
  
  // ISO Specific Fields
  isoStandard: z.string().optional(),
  industryType: z.string().optional(),
  employeeCount: z.string().optional(),
  certificationScope: z.string().optional(),
  
  // Copyright Specific Fields
  workTitle: z.string().optional(),
  workType: z.string().optional(),
  workDescription: z.string().optional(),
  creationDate: z.string().optional(),
  
  // Additional Requirements
  requiresSearch: z.boolean().default(false),
  requiresMonitoring: z.boolean().default(false),
  requiresRenewal: z.boolean().default(false),
  
  // Package Selection
  selectedPackage: z.enum(["Basic", "Standard", "Premium"]).default("Basic"),
  
  // Additional Requirements
  additionalRequirements: z.string().optional(),
  
  // Documents
  documents: z.array(z.instanceof(File)).optional(),
});

type TrademarkIsoFormData = z.infer<typeof trademarkIsoFormSchema>;

export default function TrademarkIsoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TrademarkIsoFormData>({
    resolver: zodResolver(trademarkIsoFormSchema),
    defaultValues: {
      service: searchParams.get("service") || "Trademark & ISO",
      subService: searchParams.get("subService") || searchParams.get("service") || "Trademark & ISO",
      requiresSearch: false,
      requiresMonitoring: false,
      requiresRenewal: false,
      selectedPackage: "Basic",
    },
  });

  const watchedService = watch("service");
  const watchedSubService = watch("subService");

  useEffect(() => {
    // Pre-fill form with URL parameters
    const service = searchParams.get("service");
    const subService = searchParams.get("subService");
    
    if (service) {
      setValue("service", service);
      setValue("subService", subService || service);
    }
  }, [searchParams, setValue]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TrademarkIsoFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key === "documents") {
          // Handle documents separately
        } else {
          formData.append(key, data[key as keyof TrademarkIsoFormData] as string);
        }
      });
      
      // Append uploaded files
      uploadedFiles.forEach(file => {
        formData.append("documents", file);
      });

      const response = await api.post(API_PATHS.FORMS.TRADEMARK_ISO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Trademark & ISO form submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error('Failed to submit trademark & ISO form:', error);
      toast.error('Failed to submit trademark & ISO form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AnimatedBackground />
      <FloatingElements />
      
      <div className="container mx-auto px-4 py-8">
        <FadeInSection>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Trademark & ISO Certification
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protect your intellectual property and achieve international quality standards
            </p>
          </div>
        </FadeInSection>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">
          {/* Service Information */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  Service Information
                </CardTitle>
                <CardDescription>
                  Basic details about the service you're requesting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service">Service Category</Label>
                    <Select value={watchedService} onValueChange={(value) => setValue("service", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trademark & ISO">Trademark & ISO</SelectItem>
                        <SelectItem value="Trademark">Trademark Registration</SelectItem>
                        <SelectItem value="ISO 9001">ISO 9001 Certification</SelectItem>
                        <SelectItem value="ISO 14001">ISO 14001 Certification</SelectItem>
                        <SelectItem value="Copyright">Copyright Registration</SelectItem>
                        <SelectItem value="Patent">Patent Services</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.service && (
                      <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="subService">Sub Service</Label>
                    <Select value={watchedSubService} onValueChange={(value) => setValue("subService", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trademark">Trademark Registration</SelectItem>
                        <SelectItem value="ISO 9001">ISO 9001 Certification</SelectItem>
                        <SelectItem value="ISO 14001">ISO 14001 Certification</SelectItem>
                        <SelectItem value="Copyright">Copyright Registration</SelectItem>
                        <SelectItem value="Patent">Patent Services</SelectItem>
                        <SelectItem value="Trademark & ISO">Trademark & ISO</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subService && (
                      <p className="text-red-500 text-sm mt-1">{errors.subService.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Personal Information */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your contact and identification details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      {...register("fullName")}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      {...register("phone")}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="pan">PAN Number *</Label>
                    <Input
                      {...register("pan")}
                      placeholder="Enter your PAN number"
                      maxLength={10}
                    />
                    {errors.pan && (
                      <p className="text-red-500 text-sm mt-1">{errors.pan.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Business Details */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-purple-600" />
                  Business Details
                </CardTitle>
                <CardDescription>
                  Information about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      {...register("businessName")}
                      placeholder="Enter business name"
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select onValueChange={(value) => setValue("businessType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private Limited">Private Limited</SelectItem>
                        <SelectItem value="Public Limited">Public Limited</SelectItem>
                        <SelectItem value="LLP">LLP</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.businessType && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      {...register("gstin")}
                      placeholder="Enter GSTIN"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="employeeCount">Number of Employees</Label>
                    <Input
                      {...register("employeeCount")}
                      placeholder="Enter employee count"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Textarea
                    {...register("businessAddress")}
                    placeholder="Enter complete business address"
                    rows={3}
                  />
                  {errors.businessAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessAddress.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      {...register("city")}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      {...register("state")}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      {...register("pincode")}
                      placeholder="Enter pincode"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Trademark Specific Fields */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-orange-600" />
                  Trademark Details
                </CardTitle>
                <CardDescription>
                  Information specific to trademark registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trademarkName">Trademark Name/Logo</Label>
                    <Input
                      {...register("trademarkName")}
                      placeholder="Enter trademark name or description"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="trademarkClass">Trademark Class</Label>
                    <Select onValueChange={(value) => setValue("trademarkClass", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trademark class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Class 1">Class 1 - Chemicals</SelectItem>
                        <SelectItem value="Class 2">Class 2 - Paints</SelectItem>
                        <SelectItem value="Class 3">Class 3 - Cosmetics</SelectItem>
                        <SelectItem value="Class 4">Class 4 - Lubricants</SelectItem>
                        <SelectItem value="Class 5">Class 5 - Pharmaceuticals</SelectItem>
                        <SelectItem value="Class 6">Class 6 - Metals</SelectItem>
                        <SelectItem value="Class 7">Class 7 - Machinery</SelectItem>
                        <SelectItem value="Class 8">Class 8 - Hand Tools</SelectItem>
                        <SelectItem value="Class 9">Class 9 - Electronics</SelectItem>
                        <SelectItem value="Class 10">Class 10 - Medical Devices</SelectItem>
                        <SelectItem value="Class 11">Class 11 - Appliances</SelectItem>
                        <SelectItem value="Class 12">Class 12 - Vehicles</SelectItem>
                        <SelectItem value="Class 13">Class 13 - Firearms</SelectItem>
                        <SelectItem value="Class 14">Class 14 - Jewelry</SelectItem>
                        <SelectItem value="Class 15">Class 15 - Musical Instruments</SelectItem>
                        <SelectItem value="Class 16">Class 16 - Paper Products</SelectItem>
                        <SelectItem value="Class 17">Class 17 - Rubber Products</SelectItem>
                        <SelectItem value="Class 18">Class 18 - Leather Goods</SelectItem>
                        <SelectItem value="Class 19">Class 19 - Building Materials</SelectItem>
                        <SelectItem value="Class 20">Class 20 - Furniture</SelectItem>
                        <SelectItem value="Class 21">Class 21 - Household Items</SelectItem>
                        <SelectItem value="Class 22">Class 22 - Ropes & Textiles</SelectItem>
                        <SelectItem value="Class 23">Class 23 - Yarns</SelectItem>
                        <SelectItem value="Class 24">Class 24 - Fabrics</SelectItem>
                        <SelectItem value="Class 25">Class 25 - Clothing</SelectItem>
                        <SelectItem value="Class 26">Class 26 - Lace & Embroidery</SelectItem>
                        <SelectItem value="Class 27">Class 27 - Floor Coverings</SelectItem>
                        <SelectItem value="Class 28">Class 28 - Games & Toys</SelectItem>
                        <SelectItem value="Class 29">Class 29 - Meat & Dairy</SelectItem>
                        <SelectItem value="Class 30">Class 30 - Coffee & Tea</SelectItem>
                        <SelectItem value="Class 31">Class 31 - Agriculture</SelectItem>
                        <SelectItem value="Class 32">Class 32 - Beverages</SelectItem>
                        <SelectItem value="Class 33">Class 33 - Alcoholic Beverages</SelectItem>
                        <SelectItem value="Class 34">Class 34 - Tobacco</SelectItem>
                        <SelectItem value="Class 35">Class 35 - Advertising</SelectItem>
                        <SelectItem value="Class 36">Class 36 - Insurance</SelectItem>
                        <SelectItem value="Class 37">Class 37 - Construction</SelectItem>
                        <SelectItem value="Class 38">Class 38 - Telecommunications</SelectItem>
                        <SelectItem value="Class 39">Class 39 - Transportation</SelectItem>
                        <SelectItem value="Class 40">Class 40 - Treatment of Materials</SelectItem>
                        <SelectItem value="Class 41">Class 41 - Education</SelectItem>
                        <SelectItem value="Class 42">Class 42 - Scientific Services</SelectItem>
                        <SelectItem value="Class 43">Class 43 - Food Services</SelectItem>
                        <SelectItem value="Class 44">Class 44 - Medical Services</SelectItem>
                        <SelectItem value="Class 45">Class 45 - Legal Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="trademarkDescription">Trademark Description</Label>
                  <Textarea
                    {...register("trademarkDescription")}
                    placeholder="Describe your trademark, logo, or brand"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="existingTrademarks">Existing Similar Trademarks</Label>
                  <Textarea
                    {...register("existingTrademarks")}
                    placeholder="List any existing similar trademarks you're aware of"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* ISO Specific Fields */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-indigo-600" />
                  ISO Certification Details
                </CardTitle>
                <CardDescription>
                  Information specific to ISO certification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="isoStandard">ISO Standard</Label>
                    <Select onValueChange={(value) => setValue("isoStandard", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ISO standard" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ISO 9001">ISO 9001 - Quality Management</SelectItem>
                        <SelectItem value="ISO 14001">ISO 14001 - Environmental Management</SelectItem>
                        <SelectItem value="ISO 45001">ISO 45001 - Occupational Health & Safety</SelectItem>
                        <SelectItem value="ISO 27001">ISO 27001 - Information Security</SelectItem>
                        <SelectItem value="ISO 22000">ISO 22000 - Food Safety</SelectItem>
                        <SelectItem value="ISO 13485">ISO 13485 - Medical Devices</SelectItem>
                        <SelectItem value="Other">Other ISO Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="industryType">Industry Type</Label>
                    <Select onValueChange={(value) => setValue("industryType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                        <SelectItem value="IT & Software">IT & Software</SelectItem>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="certificationScope">Certification Scope</Label>
                  <Textarea
                    {...register("certificationScope")}
                    placeholder="Describe the scope of activities to be certified"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Copyright Specific Fields */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-green-600" />
                  Copyright Details
                </CardTitle>
                <CardDescription>
                  Information specific to copyright registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workTitle">Work Title</Label>
                    <Input
                      {...register("workTitle")}
                      placeholder="Enter the title of your work"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="workType">Type of Work</Label>
                    <Select onValueChange={(value) => setValue("workType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Literary Work">Literary Work</SelectItem>
                        <SelectItem value="Artistic Work">Artistic Work</SelectItem>
                        <SelectItem value="Musical Work">Musical Work</SelectItem>
                        <SelectItem value="Cinematographic Work">Cinematographic Work</SelectItem>
                        <SelectItem value="Sound Recording">Sound Recording</SelectItem>
                        <SelectItem value="Computer Software">Computer Software</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="workDescription">Work Description</Label>
                  <Textarea
                    {...register("workDescription")}
                    placeholder="Describe your copyrighted work"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="creationDate">Creation Date</Label>
                  <Input
                    {...register("creationDate")}
                    type="date"
                  />
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Additional Requirements */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                  Additional Requirements
                </CardTitle>
                <CardDescription>
                  Select any additional services you may need
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresSearch"
                      {...register("requiresSearch")}
                    />
                    <Label htmlFor="requiresSearch">Trademark Search</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresMonitoring"
                      {...register("requiresMonitoring")}
                    />
                    <Label htmlFor="requiresMonitoring">Trademark Monitoring</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresRenewal"
                      {...register("requiresRenewal")}
                    />
                    <Label htmlFor="requiresRenewal">Renewal Services</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                  <Textarea
                    {...register("additionalRequirements")}
                    placeholder="Any other specific requirements or special instructions"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Package Selection */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="h-6 w-6 text-yellow-600" />
                  Package Selection
                </CardTitle>
                <CardDescription>
                  Choose the package that best suits your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">Basic</h3>
                      <p className="text-sm text-gray-600 mb-3">Essential registration services</p>
                      <div className="flex items-center justify-center">
                        <input
                          type="radio"
                          name="selectedPackage"
                          value="Basic"
                          checked={watch("selectedPackage") === "Basic"}
                          onChange={(e) => setValue("selectedPackage", e.target.value as "Basic" | "Standard" | "Premium")}
                          className="mr-2"
                        />
                        <Label>Select Basic</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">Standard</h3>
                      <p className="text-sm text-gray-600 mb-3">Comprehensive services with support</p>
                      <div className="flex items-center justify-center">
                        <input
                          type="radio"
                          name="selectedPackage"
                          value="Standard"
                          checked={watch("selectedPackage") === "Standard"}
                          onChange={(e) => setValue("selectedPackage", e.target.value as "Basic" | "Standard" | "Premium")}
                          className="mr-2"
                        />
                        <Label>Select Standard</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">Premium</h3>
                      <p className="text-sm text-gray-600 mb-3">Full service with priority support</p>
                      <div className="flex items-center justify-center">
                        <input
                          type="radio"
                          name="selectedPackage"
                          value="Premium"
                          checked={watch("selectedPackage") === "Premium"}
                          onChange={(e) => setValue("selectedPackage", e.target.value as "Basic" | "Standard" | "Premium")}
                          className="mr-2"
                        />
                        <Label>Select Premium</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Document Upload */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-6 w-6 text-red-600" />
                  Document Upload
                </CardTitle>
                <CardDescription>
                  Upload required documents (business documents, trademark samples, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="documents">Upload Documents</Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.svg"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, SVG (Max 10 files)
                  </p>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div>
                    <Label>Uploaded Files:</Label>
                    <div className="space-y-2 mt-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Submit Button */}
          <FadeInSection>
            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Trademark & ISO Form
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </FadeInSection>
        </form>
      </div>
    </div>
  );
}
