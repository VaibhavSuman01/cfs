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
import { CheckCircle, ArrowRight, TrendingUp, Users, Building, Lightbulb, Upload, Plus, Trash2, FileText, Target } from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";

const advisoryFormSchema = z.object({
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
  
  // Business Profile
  industry: z.string().min(1, "Industry is required"),
  businessAge: z.string().optional(),
  employeeCount: z.string().optional(),
  annualTurnover: z.string().optional(),
  
  // Advisory Specific Fields
  advisoryArea: z.string().min(1, "Advisory area is required"),
  businessChallenges: z.string().min(1, "Business challenges are required"),
  expectedOutcomes: z.string().min(1, "Expected outcomes are required"),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  
  // Project Details
  projectScope: z.string().optional(),
  keyStakeholders: z.string().optional(),
  currentProcesses: z.string().optional(),
  
  // Additional Requirements
  requiresStrategy: z.boolean().default(false),
  requiresImplementation: z.boolean().default(false),
  requiresTraining: z.boolean().default(false),
  
  // Package Selection
  selectedPackage: z.enum(["Basic", "Standard", "Premium"]).default("Basic"),
  
  // Additional Requirements
  additionalRequirements: z.string().optional(),
  
  // Documents
  documents: z.array(z.instanceof(File)).optional(),
});

type AdvisoryFormData = z.infer<typeof advisoryFormSchema>;

export default function AdvisoryForm() {
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
  } = useForm<AdvisoryFormData>({
    resolver: zodResolver(advisoryFormSchema),
    defaultValues: {
      service: searchParams.get("service") || "Advisory",
      subService: searchParams.get("subService") || searchParams.get("service") || "Advisory",
      requiresStrategy: false,
      requiresImplementation: false,
      requiresTraining: false,
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

  const onSubmit = async (data: AdvisoryFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key === "documents") {
          // Handle documents separately
        } else {
          formData.append(key, data[key as keyof AdvisoryFormData] as string);
        }
      });
      
      // Append uploaded files
      uploadedFiles.forEach(file => {
        formData.append("documents", file);
      });

      const response = await api.post(API_PATHS.FORMS.ADVISORY, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Advisory form submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error('Failed to submit advisory form:', error);
      toast.error('Failed to submit advisory form. Please try again.');
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
              Business Advisory & Consulting
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get expert guidance to transform your business and achieve sustainable growth
            </p>
          </div>
        </FadeInSection>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">
          {/* Service Information */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
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
                        <SelectItem value="Advisory">Advisory</SelectItem>
                        <SelectItem value="Business Strategy Consulting">Business Strategy Consulting</SelectItem>
                        <SelectItem value="Financial Planning & Analysis">Financial Planning & Analysis</SelectItem>
                        <SelectItem value="HR & Organizational Development">HR & Organizational Development</SelectItem>
                        <SelectItem value="Legal & Compliance Advisory">Legal & Compliance Advisory</SelectItem>
                        <SelectItem value="Digital Transformation">Digital Transformation</SelectItem>
                        <SelectItem value="Startup Mentoring">Startup Mentoring</SelectItem>
                        <SelectItem value="Tax Planning & Analysis">Tax Planning & Analysis</SelectItem>
                        <SelectItem value="Assistance for Fund Raising">Assistance for Fund Raising</SelectItem>
                        <SelectItem value="Other Finance Related Services">Other Finance Related Services</SelectItem>
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
                        <SelectItem value="Business Strategy Consulting">Business Strategy Consulting</SelectItem>
                        <SelectItem value="Financial Planning & Analysis">Financial Planning & Analysis</SelectItem>
                        <SelectItem value="HR & Organizational Development">HR & Organizational Development</SelectItem>
                        <SelectItem value="Legal & Compliance Advisory">Legal & Compliance Advisory</SelectItem>
                        <SelectItem value="Digital Transformation">Digital Transformation</SelectItem>
                        <SelectItem value="Startup Mentoring">Startup Mentoring</SelectItem>
                        <SelectItem value="Tax Planning & Analysis">Tax Planning & Analysis</SelectItem>
                        <SelectItem value="Assistance for Fund Raising">Assistance for Fund Raising</SelectItem>
                        <SelectItem value="Other Finance Related Services">Other Finance Related Services</SelectItem>
                        <SelectItem value="Advisory">Advisory</SelectItem>
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
                        <SelectItem value="Startup">Startup</SelectItem>
                        <SelectItem value="SME">SME</SelectItem>
                        <SelectItem value="MSME">MSME</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.businessType && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select onValueChange={(value) => setValue("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                        <SelectItem value="Automotive">Automotive</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.industry && (
                      <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      {...register("gstin")}
                      placeholder="Enter GSTIN"
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
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  
                  <div>
                    <Label htmlFor="businessAge">Business Age (Years)</Label>
                    <Input
                      {...register("businessAge")}
                      placeholder="Enter business age"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employeeCount">Number of Employees</Label>
                    <Input
                      {...register("employeeCount")}
                      placeholder="Enter employee count"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="annualTurnover">Annual Turnover</Label>
                    <Input
                      {...register("annualTurnover")}
                      placeholder="Enter annual turnover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Advisory Specific Fields */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-600" />
                  Advisory Requirements
                </CardTitle>
                <CardDescription>
                  Specific details about your advisory needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="advisoryArea">Primary Advisory Area *</Label>
                  <Select onValueChange={(value) => setValue("advisoryArea", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary advisory area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Business Strategy">Business Strategy</SelectItem>
                      <SelectItem value="Financial Planning">Financial Planning</SelectItem>
                      <SelectItem value="Operations Management">Operations Management</SelectItem>
                      <SelectItem value="Marketing Strategy">Marketing Strategy</SelectItem>
                      <SelectItem value="HR & Organization">HR & Organization</SelectItem>
                      <SelectItem value="Legal & Compliance">Legal & Compliance</SelectItem>
                      <SelectItem value="Digital Transformation">Digital Transformation</SelectItem>
                      <SelectItem value="Tax Planning">Tax Planning</SelectItem>
                      <SelectItem value="Fund Raising">Fund Raising</SelectItem>
                      <SelectItem value="Risk Management">Risk Management</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.advisoryArea && (
                    <p className="text-red-500 text-sm mt-1">{errors.advisoryArea.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="businessChallenges">Business Challenges *</Label>
                  <Textarea
                    {...register("businessChallenges")}
                    placeholder="Describe the main challenges your business is facing"
                    rows={4}
                  />
                  {errors.businessChallenges && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessChallenges.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="expectedOutcomes">Expected Outcomes *</Label>
                  <Textarea
                    {...register("expectedOutcomes")}
                    placeholder="What do you hope to achieve through this advisory service?"
                    rows={4}
                  />
                  {errors.expectedOutcomes && (
                    <p className="text-red-500 text-sm mt-1">{errors.expectedOutcomes.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeline">Expected Timeline</Label>
                    <Select onValueChange={(value) => setValue("timeline", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate (1-3 months)">Immediate (1-3 months)</SelectItem>
                        <SelectItem value="Short term (3-6 months)">Short term (3-6 months)</SelectItem>
                        <SelectItem value="Medium term (6-12 months)">Medium term (6-12 months)</SelectItem>
                        <SelectItem value="Long term (1+ years)">Long term (1+ years)</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select onValueChange={(value) => setValue("budget", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under 50K">Under ₹50,000</SelectItem>
                        <SelectItem value="50K-1L">₹50,000 - ₹1,00,000</SelectItem>
                        <SelectItem value="1L-5L">₹1,00,000 - ₹5,00,000</SelectItem>
                        <SelectItem value="5L-10L">₹5,00,000 - ₹10,00,000</SelectItem>
                        <SelectItem value="10L+">Above ₹10,00,000</SelectItem>
                        <SelectItem value="To be discussed">To be discussed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInSection>

          {/* Project Details */}
          <FadeInSection>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                  Project Details
                </CardTitle>
                <CardDescription>
                  Additional information about your project scope
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="projectScope">Project Scope</Label>
                  <Textarea
                    {...register("projectScope")}
                    placeholder="Describe the scope of work you need assistance with"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="keyStakeholders">Key Stakeholders</Label>
                  <Textarea
                    {...register("keyStakeholders")}
                    placeholder="List the key people who will be involved in this project"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentProcesses">Current Processes</Label>
                  <Textarea
                    {...register("currentProcesses")}
                    placeholder="Describe your current business processes and systems"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresStrategy"
                      {...register("requiresStrategy")}
                    />
                    <Label htmlFor="requiresStrategy">Strategy Development</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresImplementation"
                      {...register("requiresImplementation")}
                    />
                    <Label htmlFor="requiresImplementation">Implementation Support</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresTraining"
                      {...register("requiresTraining")}
                    />
                    <Label htmlFor="requiresTraining">Team Training</Label>
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
                      <p className="text-sm text-gray-600 mb-3">Essential advisory services</p>
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
                      <p className="text-sm text-gray-600 mb-3">Comprehensive advisory with support</p>
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
                      <p className="text-sm text-gray-600 mb-3">Full service with ongoing support</p>
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
                  Upload relevant business documents and presentations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="documents">Upload Documents</Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, JPEG, PNG (Max 10 files)
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
                    Submit Advisory Form
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
