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
import { CheckCircle, ArrowRight, Building, FileText, Users, Calendar, Upload, Plus, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import api, { API_PATHS } from "@/lib/api-client";

const rocFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pan: z.string().length(10, "PAN must be exactly 10 characters").toUpperCase(),
  service: z.string().min(1, "Service is required"),
  subService: z.string().min(1, "Sub-service is required"),
  
  // Company Details
  companyName: z.string().min(1, "Company name is required"),
  cin: z.string().min(1, "CIN number is required"),
  companyType: z.string().min(1, "Company type is required"),
  registeredOfficeAddress: z.string().min(1, "Registered office address is required"),
  
  // Service Specific Fields
  financialYear: z.string().min(1, "Financial year is required"),
  boardMeetingDate: z.string().optional(),
  resolutionType: z.string().optional(),
  directorName: z.string().optional(),
  changeType: z.string().optional(),
  lastFilingDate: z.string().optional(),
  pendingCompliances: z.string().optional(),
  
  // Additional Requirements
  requiresAudit: z.boolean().default(false),
  requiresDigitalSignature: z.boolean().default(false),
  requiresExpertConsultation: z.boolean().default(false),
  requiresComplianceSetup: z.boolean().default(false),
  
  // Package Selection
  selectedPackage: z.enum(["Basic", "Standard", "Premium"]).default("Basic"),
});

type RocFormData = z.infer<typeof rocFormSchema>;

export default function RocReturnsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RocFormData>({
    resolver: zodResolver(rocFormSchema),
    defaultValues: {
      service: searchParams.get("service") || "ROC Returns",
      subService: searchParams.get("subService") || searchParams.get("service") || "ROC Returns",
      requiresAudit: false,
      requiresDigitalSignature: false,
      requiresExpertConsultation: false,
      requiresComplianceSetup: false,
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

    // Pre-fill user data if available
    if (user) {
      setValue("fullName", user.name || "");
      setValue("email", user.email || "");
      setValue("phone", user.mobile || "");
      setValue("pan", user.pan || "");
    }
  }, [searchParams, setValue, user]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Initialize document types for new files
    const newTypes = files.map(() => "General Document");
    setDocumentTypes(prev => [...prev, ...newTypes]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setDocumentTypes(prev => prev.filter((_, i) => i !== index));
  };

  const updateDocumentType = (index: number, type: string) => {
    const newTypes = [...documentTypes];
    newTypes[index] = type;
    setDocumentTypes(newTypes);
  };

  const onSubmit = async (data: RocFormData) => {
    if (!user) {
      toast.error("Please login to submit the form");
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key === "requiresAudit" || key === "requiresDigitalSignature" || 
            key === "requiresExpertConsultation" || key === "requiresComplianceSetup") {
          formData.append(key, data[key as keyof RocFormData] ? "true" : "false");
        } else {
          formData.append(key, data[key as keyof RocFormData] as string);
        }
      });
      
      // Append uploaded files with document types
      uploadedFiles.forEach((file, index) => {
        formData.append("documents", file);
        formData.append(`documentType_${index}`, documentTypes[index] || "General Document");
      });

      const response = await api.post(API_PATHS.FORMS.ROC_RETURNS, formData);

      toast.success("ROC Returns form submitted successfully!");
      router.push("/dashboard/roc-returns");
    } catch (error: any) {
      console.error('Failed to submit ROC returns form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit ROC returns form. Please try again.';
      toast.error(errorMessage);
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
              ROC Returns & Company Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your company compliance and ROC filing requirements with our comprehensive services
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
                        <SelectItem value="ROC Returns">ROC Returns</SelectItem>
                        <SelectItem value="Annual Filing">Annual Filing</SelectItem>
                        <SelectItem value="Board Resolutions">Board Resolutions</SelectItem>
                        <SelectItem value="Director Changes">Director Changes</SelectItem>
                        <SelectItem value="Share Transfer">Share Transfer</SelectItem>
                        <SelectItem value="Company Compliance">Company Compliance</SelectItem>
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
                        <SelectItem value="Annual Filing">Annual Filing</SelectItem>
                        <SelectItem value="Board Resolutions">Board Resolutions</SelectItem>
                        <SelectItem value="Director Changes">Director Changes</SelectItem>
                        <SelectItem value="Share Transfer">Share Transfer</SelectItem>
                        <SelectItem value="Company Compliance">Company Compliance</SelectItem>
                        <SelectItem value="ROC Returns">ROC Returns</SelectItem>
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

          {/* Company Details */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-purple-600" />
                  Company Details
                </CardTitle>
                <CardDescription>
                  Information about your company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      {...register("companyName")}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="cin">CIN Number *</Label>
                    <Input
                      {...register("cin")}
                      placeholder="Enter CIN number"
                    />
                    {errors.cin && (
                      <p className="text-red-500 text-sm mt-1">{errors.cin.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="companyType">Company Type *</Label>
                    <Select onValueChange={(value) => setValue("companyType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private Limited">Private Limited</SelectItem>
                        <SelectItem value="Public Limited">Public Limited</SelectItem>
                        <SelectItem value="One Person Company">One Person Company</SelectItem>
                        <SelectItem value="LLP">LLP</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.companyType && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyType.message}</p>
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
                </div>
                
                <div>
                  <Label htmlFor="registeredOfficeAddress">Registered Office Address *</Label>
                  <Textarea
                    {...register("registeredOfficeAddress")}
                    placeholder="Enter complete registered office address"
                    rows={3}
                  />
                  {errors.registeredOfficeAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.registeredOfficeAddress.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="boardMeetingDate">Board Meeting Date</Label>
                    <Input
                      {...register("boardMeetingDate")}
                      type="date"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastFilingDate">Last Filing Date</Label>
                    <Input
                      {...register("lastFilingDate")}
                      type="date"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="pendingCompliances">Pending Compliances</Label>
                  <Textarea
                    {...register("pendingCompliances")}
                    placeholder="List any pending compliances or issues"
                    rows={3}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresAudit"
                      {...register("requiresAudit")}
                    />
                    <Label htmlFor="requiresAudit">Requires Audit</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresDigitalSignature"
                      {...register("requiresDigitalSignature")}
                    />
                    <Label htmlFor="requiresDigitalSignature">Digital Signature Certificate</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresExpertConsultation"
                      {...register("requiresExpertConsultation")}
                    />
                    <Label htmlFor="requiresExpertConsultation">Expert Consultation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresComplianceSetup"
                      {...register("requiresComplianceSetup")}
                    />
                    <Label htmlFor="requiresComplianceSetup">Compliance Setup</Label>
                  </div>
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
                      <p className="text-sm text-gray-600 mb-3">Essential filing and compliance</p>
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
                      <p className="text-sm text-gray-600 mb-3">Comprehensive filing with support</p>
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
                  Upload required documents (PAN, Aadhaar, business documents, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="documents">Upload Documents *</Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10 files)
                  </p>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div>
                    <Label>Uploaded Files:</Label>
                    <div className="space-y-2 mt-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{file.name}</span>
                            <Select value={documentTypes[index]} onValueChange={(value) => updateDocumentType(index, value)}>
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PAN Card">PAN Card</SelectItem>
                                <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                                <SelectItem value="Company Documents">Company Documents</SelectItem>
                                <SelectItem value="Financial Statements">Financial Statements</SelectItem>
                                <SelectItem value="Board Resolutions">Board Resolutions</SelectItem>
                                <SelectItem value="Other Documents">Other Documents</SelectItem>
                                <SelectItem value="General Document">General Document</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
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
                    Submit ROC Returns Form
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
