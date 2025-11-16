"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, ArrowLeft, FileText, Plus, X } from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PersonalInformationDropdown } from "@/components/ui/personal-information-dropdown";
import { Checkbox } from "@/components/ui/checkbox";

// Base schema with all fields (validation handled conditionally)
const otherRegistrationSchema = z.object({
  registrationType: z.string().min(1, "Registration type is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessDetails: z.string().min(1, "Business details/descriptions are required"),
  // Partnership firm fields (optional, validated conditionally)
  businessAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  addressProofType: z.enum(["rent", "owned"]).optional(),
  ownerName: z.string().optional(),
  ownerPan: z.string().optional(),
  ownerAadhaar: z.string().optional(),
  partnershipDeedDate: z.string().optional(),
  partnershipDeedNotarized: z.string().optional(),
  partnershipDeedStampDuty: z.string().optional(),
  requiresGstRegistration: z.boolean().optional(),
  requiresBankAccount: z.boolean().optional(),
  requiresCompliance: z.boolean().optional(),
  selectedPackage: z.string().optional(),
}).refine((data) => {
  // If partnership-firm, validate required fields
  if (data.registrationType === "partnership-firm") {
    return !!(
      data.businessAddress &&
      data.city &&
      data.state &&
      data.pincode &&
      data.addressProofType
    );
  }
  return true;
}, {
  message: "Business address, city, state, pincode, and address proof type are required for partnership firm",
  path: ["businessAddress"],
});

type OtherRegistrationValues = z.infer<typeof otherRegistrationSchema>;

export default function OtherRegistrationPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [cancelCheckFile, setCancelCheckFile] = useState<File | null>(null);
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [electricityBillFile, setElectricityBillFile] = useState<File | null>(null);
  const [rentAgreementFile, setRentAgreementFile] = useState<File | null>(null);
  
  // Partnership firm specific state
  const [partners, setPartners] = useState<Array<{
    name: string;
    email: string;
    phone: string;
    pan: string;
    aadhaar: string;
    address: string;
  }>>([{ name: "", email: "", phone: "", pan: "", aadhaar: "", address: "" }]);
  const [partnerFiles, setPartnerFiles] = useState<Record<number, {
    photo?: File;
    signature?: File;
    aadhaar?: File;
    pan?: File;
  }>>({});
  const [ownerPanAadhaarFile, setOwnerPanAadhaarFile] = useState<File | null>(null);
  const [municipalTaxReceiptFile, setMunicipalTaxReceiptFile] = useState<File | null>(null);

  // Map registration type values to display names
  const registrationTypeNames: Record<string, string> = {
    "llp-registration": "LLP Registration",
    "partnership-firm": "Partnership Firm",
    "sole-proprietorship": "Sole Proprietorship",
    "msme-udyam": "MSME/Udyam Registration",
    "epfo": "EPFO Registration",
    "esic": "ESIC Registration",
    "pt-tax": "PT Tax Registration",
    "iec-registration": "IEC Registration",
    "gumusta-shop": "Gumusta / Shop Registration",
    "fassai-food": "Fassai (Food) Licence",
    "industry-license": "Industry Licence",
    "ngo-registration": "NGO Registration",
    "pan-apply": "PAN Application",
    "tan-apply": "TAN Application",
    "startup-india": "Start-up India Registration",
    "digital-signature": "Digital Signature",
    "gst-registration": "GST Registration",
  };

  // Map service names from dashboard to registration type values
  const serviceToRegistrationType: Record<string, string> = {
    "GST Registration": "gst-registration",
    "LLP Registration": "llp-registration",
    "Partnership Firm": "partnership-firm",
    "Proprietorship": "sole-proprietorship",
    "MSME/Udyam Registration": "msme-udyam",
    "EPFO": "epfo",
    "ESIC": "esic",
    "PT Tax": "pt-tax",
    "IEC Registration": "iec-registration",
    "Gumusta / Form-3 / Shop Registration": "gumusta-shop",
    "Fassai (Food) Licence / Register": "fassai-food",
    "Industry Licence / register": "industry-license",
    "NGO Registration": "ngo-registration",
    "PAN Apply": "pan-apply",
    "TAN Apply": "tan-apply",
    "Start-up India Registration": "startup-india",
    "Digital Registration": "digital-signature",
  };

  // Get service from URL
  const serviceParam = searchParams?.get("service") || "";
  const registrationTypeFromUrl = serviceParam ? (serviceToRegistrationType[serviceParam] || "") : "";
  const isServiceFromUrl = !!serviceParam;

  const form = useForm<OtherRegistrationValues>({
    resolver: zodResolver(otherRegistrationSchema),
    defaultValues: {
      registrationType: registrationTypeFromUrl || "",
      businessName: "",
      businessDetails: "",
      businessAddress: "",
      city: "",
      state: "",
      pincode: "",
      addressProofType: undefined,
      ownerName: "",
      ownerPan: "",
      ownerAadhaar: "",
      partnershipDeedDate: "",
      partnershipDeedNotarized: "",
      partnershipDeedStampDuty: "",
      requiresGstRegistration: false,
      requiresBankAccount: false,
      requiresCompliance: false,
      selectedPackage: "Basic",
    },
    mode: "onChange",
  });

  const registrationType = form.watch("registrationType");

  // Update form default values when URL changes
  useEffect(() => {
    if (registrationTypeFromUrl) {
      form.setValue("registrationType", registrationTypeFromUrl);
    }
  }, [registrationTypeFromUrl, form]);

  const onSubmit = async (data: OtherRegistrationValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Check if this is partnership-firm
      const isPartnershipFirm = data.registrationType === "partnership-firm";

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      });

      // Append user profile data (non-editable fields)
      if (user) {
        formData.append("fullName", user.name || "");
        formData.append("email", user.email || "");
        formData.append("phone", user.mobile || "");
        formData.append("pan", user.pan || "");
      }

      // Add service and subService fields for backend compatibility
      formData.append("service", "Other Registration");
      formData.append("subService", data.registrationType);

      // Partnership firm specific data
      if (isPartnershipFirm) {
        // Validate partners
        const validPartners = partners.filter(p => 
          p.name && p.email && p.phone && p.pan && p.aadhaar && p.address
        );
        
        if (validPartners.length === 0) {
          toast.error("At least one partner with all details is required");
          setIsSubmitting(false);
          return;
        }

        formData.append("partners", JSON.stringify(validPartners));

        // Append partner files
        validPartners.forEach((partner, index) => {
          const files = partnerFiles[index];
          if (files?.photo) formData.append(`partnerPhoto_${index}`, files.photo);
          if (files?.signature) formData.append(`partnerSignature_${index}`, files.signature);
          if (files?.aadhaar) formData.append(`partnerAadhaar_${index}`, files.aadhaar);
          if (files?.pan) formData.append(`partnerPan_${index}`, files.pan);
        });

        // Partnership firm specific files
        if (rentAgreementFile) formData.append("rentAgreement", rentAgreementFile);
        if (electricityBillFile) formData.append("electricityBill", electricityBillFile);
        if (ownerPanAadhaarFile) formData.append("ownerPanAadhaar", ownerPanAadhaarFile);
        if (municipalTaxReceiptFile) formData.append("municipalTaxReceipt", municipalTaxReceiptFile);
      } else {
        // Regular other registration files
        if (aadhaarFile) formData.append("aadhaarFile", aadhaarFile);
        if (panFile) formData.append("panFile", panFile);
        if (cancelCheckFile) formData.append("cancelCheckFile", cancelCheckFile);
        if (gstFile) formData.append("gstFile", gstFile);
        if (electricityBillFile) formData.append("electricityBillFile", electricityBillFile);
        if (rentAgreementFile) formData.append("rentAgreementFile", rentAgreementFile);
      }

      // Append other documents
      files.forEach((file) => {
        formData.append("documents", file);
      });

      // Route to appropriate endpoint
      const endpoint = isPartnershipFirm 
        ? API_PATHS.FORMS.PARTNERSHIP_FIRM 
        : API_PATHS.FORMS.OTHER_REGISTRATION;

      await api.post(endpoint, formData);

      toast.success("Registration application submitted successfully");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Failed to submit registration form:", error);
      
      // Handle specific error cases
      if (error?.response?.status === 400 && error?.response?.data?.message?.includes("already exists")) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else if (error?.response?.status === 409) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else {
        toast.error(error?.response?.data?.message || "Failed to submit registration application. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };

  const handleAadhaarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0]);
    }
  };

  const handlePanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPanFile(e.target.files[0]);
    }
  };

  const handleGstFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGstFile(e.target.files[0]);
    }
  };

  const handleElectricityBillFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setElectricityBillFile(e.target.files[0]);
    }
  };

  const handleRentAgreementFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRentAgreementFile(e.target.files[0]);
    }
  };

  const handleCancelCheckFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCancelCheckFile(e.target.files[0]);
    }
  };

  // Partnership firm helper functions
  const addPartner = () => {
    setPartners([...partners, { name: "", email: "", phone: "", pan: "", aadhaar: "", address: "" }]);
  };

  const removePartner = (index: number) => {
    setPartners(partners.filter((_, i) => i !== index));
    const newFiles = { ...partnerFiles };
    delete newFiles[index];
    setPartnerFiles(newFiles);
  };

  const updatePartner = (index: number, field: string, value: string) => {
    const updated = [...partners];
    updated[index] = { ...updated[index], [field]: value };
    setPartners(updated);
  };

  const handlePartnerFileChange = (index: number, type: "photo" | "signature" | "aadhaar" | "pan", file: File | null) => {
    setPartnerFiles({
      ...partnerFiles,
      [index]: {
        ...partnerFiles[index],
        [type]: file || undefined,
      },
    });
  };

  const handleOwnerPanAadhaarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOwnerPanAadhaarFile(e.target.files[0]);
    }
  };

  const handleMunicipalTaxReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMunicipalTaxReceiptFile(e.target.files[0]);
    }
  };

  const isPartnershipFirm = registrationType === "partnership-firm";

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">
          {registrationType ? registrationTypeNames[registrationType] || (serviceParam || "Other Registration") : (serviceParam || "Other Registration")}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {registrationType ? registrationTypeNames[registrationType] || (serviceParam || "Other Registration") : (serviceParam || "Other Registration")} Form
          </CardTitle>
          <CardDescription>
            Submit your registration application with all required details and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <PersonalInformationDropdown />

              {/* Service Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select registration type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="llp-registration">LLP Registration</SelectItem>
                            <SelectItem value="partnership-firm">Partnership Firm</SelectItem>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="digital-signature">Digital Signature</SelectItem>
                            <SelectItem value="iec-registration">IEC Registration</SelectItem>
                            <SelectItem value="ngo-registration">NGO Registration</SelectItem>
                            <SelectItem value="msme-udyam">MSME/Udyam Registration</SelectItem>
                            <SelectItem value="epfo">EPFO Registration</SelectItem>
                            <SelectItem value="esic">ESIC Registration</SelectItem>
                            <SelectItem value="gumusta-shop">Gumusta / Shop Registration</SelectItem>
                            <SelectItem value="fassai-food">Fassai (Food) Licence</SelectItem>
                            <SelectItem value="industry-license">Industry Licence</SelectItem>
                            <SelectItem value="startup-india">Start-up India Registration</SelectItem>
                            <SelectItem value="gst-registration">GST Registration</SelectItem>
                            <SelectItem value="pt-tax">PT Tax Registration</SelectItem>
                            <SelectItem value="pan-apply">PAN Application</SelectItem>
                            <SelectItem value="tan-apply">TAN Application</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter business name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="businessDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Details/Descriptions *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="Describe your business details and activities" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Partnership Firm Specific Fields */}
              {isPartnershipFirm && (
                <>
                  {/* Business Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Business Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessAddress"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Business Address *</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={2} placeholder="Enter complete business address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter state" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter pincode" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressProofType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Proof Type *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select address proof type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rent">Rent</SelectItem>
                                <SelectItem value="owned">Owned</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Owner Details (if rented) */}
                    {form.watch("addressProofType") === "rent" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="ownerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter owner name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ownerPan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner PAN</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter owner PAN" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ownerAadhaar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner Aadhaar</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter owner Aadhaar" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Partnership Deed Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="partnershipDeedDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partnership Deed Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="partnershipDeedStampDuty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stamp Duty Amount</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Enter stamp duty amount" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="partnershipDeedNotarized"
                        render={({ field }) => (
                          <FormItem className="flex flex-col justify-end">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="partnershipDeedNotarized"
                                checked={field.value === "true"}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked ? "true" : "false");
                                }}
                              />
                              <Label htmlFor="partnershipDeedNotarized" className="cursor-pointer">
                                Notarized
                              </Label>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Additional Requirements */}
                    <div className="space-y-2 mt-4">
                      <h4 className="font-medium">Additional Requirements</h4>
                      <div className="flex flex-wrap gap-4">
                        <FormField
                          control={form.control}
                          name="requiresGstRegistration"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <Checkbox
                                id="requiresGstRegistration"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label htmlFor="requiresGstRegistration" className="cursor-pointer">
                                GST Registration
                              </Label>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="requiresBankAccount"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <Checkbox
                                id="requiresBankAccount"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label htmlFor="requiresBankAccount" className="cursor-pointer">
                                Bank Account
                              </Label>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="requiresCompliance"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <Checkbox
                                id="requiresCompliance"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label htmlFor="requiresCompliance" className="cursor-pointer">
                                Compliance
                              </Label>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Package Selection */}
                    <FormField
                      control={form.control}
                      name="selectedPackage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select package" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Partners Information */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Partners Information</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addPartner}>
                        <Plus className="h-4 w-4 mr-2" /> Add Partner
                      </Button>
                    </div>
                    {partners.map((partner, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Partner {index + 1}</h4>
                          {partners.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePartner(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Name *</Label>
                            <Input
                              value={partner.name}
                              onChange={(e) => updatePartner(index, "name", e.target.value)}
                              placeholder="Enter partner name"
                            />
                          </div>
                          <div>
                            <Label>Email *</Label>
                            <Input
                              type="email"
                              value={partner.email}
                              onChange={(e) => updatePartner(index, "email", e.target.value)}
                              placeholder="Enter partner email"
                            />
                          </div>
                          <div>
                            <Label>Phone *</Label>
                            <Input
                              value={partner.phone}
                              onChange={(e) => updatePartner(index, "phone", e.target.value)}
                              placeholder="Enter partner phone"
                            />
                          </div>
                          <div>
                            <Label>PAN *</Label>
                            <Input
                              value={partner.pan}
                              onChange={(e) => updatePartner(index, "pan", e.target.value.toUpperCase())}
                              placeholder="Enter partner PAN"
                              maxLength={10}
                            />
                          </div>
                          <div>
                            <Label>Aadhaar *</Label>
                            <Input
                              value={partner.aadhaar}
                              onChange={(e) => updatePartner(index, "aadhaar", e.target.value.replace(/\D/g, "").slice(0, 12))}
                              placeholder="Enter partner Aadhaar"
                              maxLength={12}
                            />
                          </div>
                          <div>
                            <Label>Address *</Label>
                            <Textarea
                              value={partner.address}
                              onChange={(e) => updatePartner(index, "address", e.target.value)}
                              placeholder="Enter partner address"
                              rows={2}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <Label>Photo</Label>
                            <Input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handlePartnerFileChange(index, "photo", e.target.files?.[0] || null)}
                              className="mt-1"
                            />
                            {partnerFiles[index]?.photo && (
                              <p className="text-xs text-green-600 mt-1">✓ {partnerFiles[index]?.photo?.name}</p>
                            )}
                          </div>
                          <div>
                            <Label>Signature</Label>
                            <Input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handlePartnerFileChange(index, "signature", e.target.files?.[0] || null)}
                              className="mt-1"
                            />
                            {partnerFiles[index]?.signature && (
                              <p className="text-xs text-green-600 mt-1">✓ {partnerFiles[index]?.signature?.name}</p>
                            )}
                          </div>
                          <div>
                            <Label>Aadhaar Card</Label>
                            <Input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handlePartnerFileChange(index, "aadhaar", e.target.files?.[0] || null)}
                              className="mt-1"
                            />
                            {partnerFiles[index]?.aadhaar && (
                              <p className="text-xs text-green-600 mt-1">✓ {partnerFiles[index]?.aadhaar?.name}</p>
                            )}
                          </div>
                          <div>
                            <Label>PAN Card</Label>
                            <Input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handlePartnerFileChange(index, "pan", e.target.files?.[0] || null)}
                              className="mt-1"
                            />
                            {partnerFiles[index]?.pan && (
                              <p className="text-xs text-green-600 mt-1">✓ {partnerFiles[index]?.pan?.name}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Document Requirements</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Required Documents (Upload as JPG/JPEG/PDF/PNG):</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>1. Aadhaar Card</li>
                    <li>2. PAN Card</li>
                    <li>3. Mobile No. (Text)</li>
                    <li>4. Email (Text)</li>
                    <li>5. Bank Statement / Cancel Check</li>
                    <li>6. GST (If available)</li>
                    <li>7. Electricity Bill</li>
                    <li>8. Rent Agreement</li>
                    <li>9. Business Name (Text)</li>
                    <li>10. Business Detail/Descriptions (Text Box)</li>
                    <li>11. Any Other Documents (Excel, Zip, Pdf, Word)</li>
                  </ul>
                  <p className="text-xs text-blue-700 mt-3 italic">
                    Note: Required documents shall be subject to change from time to time in accordance with applicable laws, acts, rules, notifications, circulars, court judgments, and other provisions issued by the Government of India.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aadhaar-file">1. Aadhaar Card (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      id="aadhaar-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleAadhaarFileChange}
                      className="mt-1"
                    />
                    {aadhaarFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {aadhaarFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="pan-file">2. PAN Card (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      id="pan-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handlePanFileChange}
                      className="mt-1"
                    />
                    {panFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {panFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cancel-check-file">5. Bank Statement / Cancel Check (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      id="cancel-check-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleCancelCheckFileChange}
                      className="mt-1"
                    />
                    {cancelCheckFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {cancelCheckFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gst-file">6. GST Certificate (If available) (JPG/JPEG/PDF/PNG)</Label>
                    <Input
                      id="gst-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleGstFileChange}
                      className="mt-1"
                    />
                    {gstFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {gstFile.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="electricity-bill-file">7. Electricity Bill (JPG/JPEG/PDF/PNG) *</Label>
                    <Input
                      id="electricity-bill-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleElectricityBillFileChange}
                      className="mt-1"
                    />
                    {electricityBillFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {electricityBillFile.name} selected
                      </p>
                    )}
                  </div>

                  {!isPartnershipFirm && (
                    <div>
                      <Label htmlFor="rent-agreement-file">8. Rent Agreement (JPG/JPEG/PDF/PNG) *</Label>
                      <Input
                        id="rent-agreement-file"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleRentAgreementFileChange}
                        className="mt-1"
                      />
                      {rentAgreementFile && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ {rentAgreementFile.name} selected
                        </p>
                      )}
                    </div>
                  )}

                  {/* Partnership Firm Specific Documents */}
                  {isPartnershipFirm && (
                    <>
                      <div>
                        <Label htmlFor="rent-agreement">Rent Agreement (JPG/JPEG/PDF/PNG)</Label>
                        <Input
                          id="rent-agreement"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleRentAgreementFileChange}
                          className="mt-1"
                        />
                        {rentAgreementFile && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ {rentAgreementFile.name} selected
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="electricity-bill">Electricity Bill (JPG/JPEG/PDF/PNG)</Label>
                        <Input
                          id="electricity-bill"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleElectricityBillFileChange}
                          className="mt-1"
                        />
                        {electricityBillFile && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ {electricityBillFile.name} selected
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="owner-pan-aadhaar">Owner PAN/Aadhaar Card (if rented) (JPG/JPEG/PDF/PNG)</Label>
                        <Input
                          id="owner-pan-aadhaar"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleOwnerPanAadhaarFileChange}
                          className="mt-1"
                        />
                        {ownerPanAadhaarFile && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ {ownerPanAadhaarFile.name} selected
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="municipal-tax-receipt">Municipal Tax Receipt (JPG/JPEG/PDF/PNG)</Label>
                        <Input
                          id="municipal-tax-receipt"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleMunicipalTaxReceiptFileChange}
                          className="mt-1"
                        />
                        {municipalTaxReceiptFile && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ {municipalTaxReceiptFile.name} selected
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="documents">11. Any Other Documents (Excel, Zip, Pdf, Word)</Label>
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                    {files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center text-sm text-green-600">
                            <FileText className="h-4 w-4 mr-2" />
                            ✓ {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Registration Application
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
