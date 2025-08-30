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
import { CheckCircle, ArrowRight, BarChart2, Users, Building, Calculator, Upload, Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";

const reportsFormSchema = z.object({
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
  
  // Report Specific Fields
  reportPeriod: z.string().min(1, "Report period is required"),
  reportPurpose: z.string().min(1, "Report purpose is required"),
  financialYear: z.string().min(1, "Financial year is required"),
  turnover: z.string().optional(),
  employeeCount: z.string().optional(),
  
  // Financial Metrics
  revenue: z.string().optional(),
  expenses: z.string().optional(),
  profit: z.string().optional(),
  assets: z.string().optional(),
  liabilities: z.string().optional(),
  
  // Additional Requirements
  requiresAudit: z.boolean().default(false),
  requiresCertification: z.boolean().default(false),
  requiresConsultation: z.boolean().default(false),
  
  // Package Selection
  selectedPackage: z.enum(["Basic", "Standard", "Premium"]).default("Basic"),
  
  // Additional Requirements
  additionalRequirements: z.string().optional(),
  
  // Documents
  documents: z.array(z.instanceof(File)).optional(),
});

type ReportsFormData = z.infer<typeof reportsFormSchema>;

export default function ReportsForm() {
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
  } = useForm<ReportsFormData>({
    resolver: zodResolver(reportsFormSchema),
    defaultValues: {
      service: searchParams.get("service") || "Reports",
      subService: searchParams.get("subService") || searchParams.get("service") || "Reports",
      requiresAudit: false,
      requiresCertification: false,
      requiresConsultation: false,
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

  const onSubmit = async (data: ReportsFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key === "documents") {
          // Handle documents separately
        } else {
          formData.append(key, data[key as keyof ReportsFormData] as string);
        }
      });
      
      // Append uploaded files
      uploadedFiles.forEach(file => {
        formData.append("documents", file);
      });

      const response = await api.post(API_PATHS.FORMS.REPORTS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Reports form submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error('Failed to submit reports form:', error);
      toast.error('Failed to submit reports form. Please try again.');
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
              Financial Reports & Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get comprehensive financial reports and analysis to make informed business decisions
            </p>
          </div>
        </FadeInSection>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">
          {/* Service Information */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
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
                        <SelectItem value="Reports">Reports</SelectItem>
                        <SelectItem value="Bank Reconciliation">Bank Reconciliation</SelectItem>
                        <SelectItem value="CMA Reports">CMA Reports</SelectItem>
                        <SelectItem value="DSCR Reports">DSCR Reports</SelectItem>
                        <SelectItem value="Project Reports">Project Reports</SelectItem>
                        <SelectItem value="Financial Analysis">Financial Analysis</SelectItem>
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
                        <SelectItem value="Bank Reconciliation">Bank Reconciliation</SelectItem>
                        <SelectItem value="CMA Reports">CMA Reports</SelectItem>
                        <SelectItem value="DSCR Reports">DSCR Reports</SelectItem>
                        <SelectItem value="Project Reports">Project Reports</SelectItem>
                        <SelectItem value="Financial Analysis">Financial Analysis</SelectItem>
                        <SelectItem value="Reports">Reports</SelectItem>
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

          {/* Report Specific Fields */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-6 w-6 text-orange-600" />
                  Report Specific Details
                </CardTitle>
                <CardDescription>
                  Additional information specific to your report request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reportPeriod">Report Period *</Label>
                    <Select onValueChange={(value) => setValue("reportPeriod", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                        <SelectItem value="Annual">Annual</SelectItem>
                        <SelectItem value="Custom">Custom Period</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.reportPeriod && (
                      <p className="text-red-500 text-sm mt-1">{errors.reportPeriod.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="financialYear">Financial Year *</Label>
                    <Select onValueChange={(value) => setValue("financialYear", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select financial year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2022-23">2022-23</SelectItem>
                        <SelectItem value="2021-22">2021-22</SelectItem>
                        <SelectItem value="2020-21">2020-21</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.financialYear && (
                      <p className="text-red-500 text-sm mt-1">{errors.financialYear.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="turnover">Annual Turnover</Label>
                    <Input
                      {...register("turnover")}
                      placeholder="Enter annual turnover"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="revenue">Annual Revenue</Label>
                    <Input
                      {...register("revenue")}
                      placeholder="Enter annual revenue"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reportPurpose">Report Purpose *</Label>
                  <Select onValueChange={(value) => setValue("reportPurpose", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank Loan">Bank Loan</SelectItem>
                      <SelectItem value="Investor Presentation">Investor Presentation</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Business Planning">Business Planning</SelectItem>
                      <SelectItem value="Tax Planning">Tax Planning</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.reportPurpose && (
                    <p className="text-red-500 text-sm mt-1">{errors.reportPurpose.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expenses">Annual Expenses</Label>
                    <Input
                      {...register("expenses")}
                      placeholder="Enter annual expenses"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profit">Annual Profit</Label>
                    <Input
                      {...register("profit")}
                      placeholder="Enter annual profit"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="assets">Total Assets</Label>
                    <Input
                      {...register("assets")}
                      placeholder="Enter total assets value"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="liabilities">Total Liabilities</Label>
                    <Input
                      {...register("liabilities")}
                      placeholder="Enter total liabilities value"
                    />
                  </div>
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
                      id="requiresAudit"
                      {...register("requiresAudit")}
                    />
                    <Label htmlFor="requiresAudit">Audit Services</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresCertification"
                      {...register("requiresCertification")}
                    />
                    <Label htmlFor="requiresCertification">CA Certification</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresConsultation"
                      {...register("requiresConsultation")}
                    />
                    <Label htmlFor="requiresConsultation">Financial Consultation</Label>
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
                      <p className="text-sm text-gray-600 mb-3">Essential financial reports</p>
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
                      <p className="text-sm text-gray-600 mb-3">Comprehensive reports with analysis</p>
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
                      <p className="text-sm text-gray-600 mb-3">Full service with consultation</p>
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
                  Upload required documents (financial statements, bank statements, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="documents">Upload Documents</Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, XLS, XLSX (Max 10 files)
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
                    Submit Reports Form
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
