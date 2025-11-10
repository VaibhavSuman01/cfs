"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, ArrowLeft, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const partnershipFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  businessName: z.string().min(1, "Business name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 digits"),
  businessDetails: z.string().min(1, "Business details are required"),
  addressProofType: z.enum(["rent", "owned"], { required_error: "Please select address proof type" }),
  ownerName: z.string().optional(),
  ownerPan: z.string().optional(),
  ownerAadhaar: z.string().optional(),
  partnershipDeedDate: z.string().optional(),
  partnershipDeedNotarized: z.boolean().optional(),
  partnershipDeedStampDuty: z.string().optional(),
  requiresGstRegistration: z.boolean().optional(),
  requiresBankAccount: z.boolean().optional(),
  requiresCompliance: z.boolean().optional(),
  selectedPackage: z.enum(["Basic", "Standard", "Premium"]).optional(),
});

type PartnershipFormValues = z.infer<typeof partnershipFormSchema>;

interface Partner {
  name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaar: string;
  address: string;
}

export default function PartnershipFirmPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([
    { name: "", email: "", phone: "", pan: "", aadhaar: "", address: "" }
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [customDocs, setCustomDocs] = useState<Array<{ title: string; file: File | null }>>([]);

  // Document upload states
  const [partnerPhotos, setPartnerPhotos] = useState<File[]>([]);
  const [partnerSignatures, setPartnerSignatures] = useState<File[]>([]);
  const [partnerAadhaarCards, setPartnerAadhaarCards] = useState<File[]>([]);
  const [partnerPanCards, setPartnerPanCards] = useState<File[]>([]);
  const [rentAgreement, setRentAgreement] = useState<File | null>(null);
  const [electricityBill, setElectricityBill] = useState<File | null>(null);
  const [ownerPanAadhaar, setOwnerPanAadhaar] = useState<File | null>(null);
  const [municipalTaxReceipt, setMunicipalTaxReceipt] = useState<File | null>(null);

  const form = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      pan: "",
      businessName: "",
      businessAddress: "",
      city: "",
      state: "",
      pincode: "",
      businessDetails: "",
      addressProofType: "owned",
      ownerName: "",
      ownerPan: "",
      ownerAadhaar: "",
      partnershipDeedDate: "",
      partnershipDeedNotarized: false,
      partnershipDeedStampDuty: "",
      requiresGstRegistration: false,
      requiresBankAccount: false,
      requiresCompliance: false,
      selectedPackage: "Basic",
    },
  });

  // Update form when user data is available
  useEffect(() => {
    if (user) {
      const currentValues = form.getValues();
      const formData: Partial<PartnershipFormValues> = {};
      let hasChanges = false;
      
      // Pre-populate fields from user profile if they exist and are different
      if (user.name && currentValues.fullName !== user.name) {
        formData.fullName = user.name;
        hasChanges = true;
      }
      if (user.email && currentValues.email !== user.email) {
        formData.email = user.email;
        hasChanges = true;
      }
      if (user.mobile && currentValues.phone !== user.mobile) {
        formData.phone = user.mobile;
        hasChanges = true;
      }
      if (user.pan && currentValues.pan !== user.pan) {
        formData.pan = user.pan;
        hasChanges = true;
      }
      
      // Only update if there are actual changes
      if (hasChanges) {
        form.reset({
          ...currentValues,
          ...formData,
        });
      }
    }
  }, [user]);

  // Determine which fields should be disabled (if they already exist in user profile)
  const isFieldDisabled = (fieldName: keyof PartnershipFormValues) => {
    if (!user) return false;
    
    switch (fieldName) {
      case "fullName":
        return !!user.name;
      case "email":
        return !!user.email;
      case "phone":
        return !!user.mobile;
      case "pan":
        return !!user.pan;
      default:
        return false;
    }
  };

  const addressProofType = form.watch("addressProofType");

  const addPartner = () => {
    setPartners([...partners, { name: "", email: "", phone: "", pan: "", aadhaar: "", address: "" }]);
  };

  const removePartner = (index: number) => {
    if (partners.length > 1) {
      setPartners(partners.filter((_, i) => i !== index));
    }
  };

  const updatePartner = (index: number, field: keyof Partner, value: string) => {
    const updatedPartners = [...partners];
    updatedPartners[index][field] = value;
    setPartners(updatedPartners);
  };

  const onSubmit = async (data: PartnershipFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'boolean' ? value.toString() : value);
        }
      });

      // Append partners data
      formData.append("partners", JSON.stringify(partners));

      // Append document files
      partnerPhotos.forEach((file, index) => {
        formData.append(`partnerPhoto_${index}`, file);
      });
      partnerSignatures.forEach((file, index) => {
        formData.append(`partnerSignature_${index}`, file);
      });
      partnerAadhaarCards.forEach((file, index) => {
        formData.append(`partnerAadhaar_${index}`, file);
      });
      partnerPanCards.forEach((file, index) => {
        formData.append(`partnerPan_${index}`, file);
      });

      if (rentAgreement) formData.append("rentAgreement", rentAgreement);
      if (electricityBill) formData.append("electricityBill", electricityBill);
      if (ownerPanAadhaar) formData.append("ownerPanAadhaar", ownerPanAadhaar);
      if (municipalTaxReceipt) formData.append("municipalTaxReceipt", municipalTaxReceipt);

      // Append other documents
      files.forEach((file) => {
        formData.append("documents", file);
      });

      // Append custom documents
      customDocs.forEach((entry, index) => {
        if (entry.file) {
          formData.append(`customDoc_${index}`, entry.file);
          formData.append(`customDocTitle_${index}`, entry.title);
        }
      });

      await api.post(API_PATHS.FORMS.PARTNERSHIP_FIRM, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Partnership firm registration application submitted successfully");
      router.push("/dashboard/partnership-firm");
    } catch (error) {
      console.error("Failed to submit partnership firm form:", error);
      toast.error("Failed to submit partnership firm application. Please try again.");
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

  const addCustomDoc = () => {
    setCustomDocs([...customDocs, { title: "", file: null }]);
  };

  const updateCustomDocTitle = (idx: number, title: string) => {
    setCustomDocs(prev => prev.map((c, i) => i === idx ? { ...c, title } : c));
  };

  const updateCustomDocFile = (idx: number, file: File | null) => {
    setCustomDocs(prev => prev.map((c, i) => i === idx ? { ...c, file } : c));
  };

  const removeCustomDoc = (idx: number) => {
    setCustomDocs(prev => prev.filter((_, i) => i !== idx));
  };

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
        <h1 className="text-2xl font-bold">Partnership Firm Registration</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partnership Firm Registration Form</CardTitle>
          <CardDescription>
            Submit your partnership firm registration application with all required details and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Primary Applicant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={isFieldDisabled("fullName")}
                            className={isFieldDisabled("fullName") ? "bg-muted cursor-not-allowed" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                        {isFieldDisabled("fullName") && (
                          <p className="text-xs text-muted-foreground">This field is pre-filled from your profile</p>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            {...field} 
                            disabled={isFieldDisabled("email")}
                            className={isFieldDisabled("email") ? "bg-muted cursor-not-allowed" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                        {isFieldDisabled("email") && (
                          <p className="text-xs text-muted-foreground">This field is pre-filled from your profile</p>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={isFieldDisabled("phone")}
                            className={isFieldDisabled("phone") ? "bg-muted cursor-not-allowed" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                        {isFieldDisabled("phone") && (
                          <p className="text-xs text-muted-foreground">This field is pre-filled from your profile</p>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="ABCDE1234F"
                            disabled={isFieldDisabled("pan")}
                            className={isFieldDisabled("pan") ? "bg-muted cursor-not-allowed" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                        {isFieldDisabled("pan") && (
                          <p className="text-xs text-muted-foreground">This field is pre-filled from your profile</p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business/Enterprise Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter business name" />
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
                </div>
                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business/Enterprise Address *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Enter complete business address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Details *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Describe your business activities" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Partners Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Partners Information</h3>
                  <Button type="button" variant="outline" onClick={addPartner}>
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
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={partner.name}
                          onChange={(e) => updatePartner(index, "name", e.target.value)}
                          placeholder="Partner name"
                        />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={partner.email}
                          onChange={(e) => updatePartner(index, "email", e.target.value)}
                          placeholder="Partner email"
                        />
                      </div>
                      <div>
                        <Label>Phone *</Label>
                        <Input
                          value={partner.phone}
                          onChange={(e) => updatePartner(index, "phone", e.target.value)}
                          placeholder="Partner phone"
                        />
                      </div>
                      <div>
                        <Label>PAN *</Label>
                        <Input
                          value={partner.pan}
                          onChange={(e) => updatePartner(index, "pan", e.target.value.toUpperCase())}
                          placeholder="ABCDE1234F"
                        />
                      </div>
                      <div>
                        <Label>Aadhaar *</Label>
                        <Input
                          value={partner.aadhaar}
                          onChange={(e) => updatePartner(index, "aadhaar", e.target.value.replace(/\D/g, ""))}
                          placeholder="123456789012"
                          maxLength={12}
                        />
                      </div>
                      <div>
                        <Label>Address *</Label>
                        <Textarea
                          value={partner.address}
                          onChange={(e) => updatePartner(index, "address", e.target.value)}
                          placeholder="Partner address"
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Address Proof */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Address Proof</h3>
                <FormField
                  control={form.control}
                  name="addressProofType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Proof Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select address proof type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="owned">Owned Property</SelectItem>
                          <SelectItem value="rent">Rented Property</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {addressProofType === "rent" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Owner Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Owner name" />
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
                            <Input {...field} placeholder="ABCDE1234F" />
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
                            <Input {...field} placeholder="123456789012" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Partnership Deed Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Partnership Deed Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <Input {...field} placeholder="Enter stamp duty amount" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Document Requirements</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Required Documents:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Partners KYC (Photo, Signature, Aadhaar Card, PAN Card)</li>
                    <li>• Business Address Proof (Rent Agreement, Electricity Bill)</li>
                    <li>• Owner's PAN/Aadhaar (if rented property)</li>
                    <li>• Municipal Tax Receipt</li>
                    <li>• Partnership Deed</li>
                    <li>• Any Other Documents (Excel, Zip, Pdf, Word)</li>
                  </ul>
                </div>

                {/* Partners Documents */}
                <div className="space-y-4">
                  <h4 className="font-medium">Partners KYC Documents</h4>
                  
                  <div>
                    <Label>Partner Photos (JPG/PNG)</Label>
                    <Input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => setPartnerPhotos(Array.from(e.target.files || []))}
                      className="mt-1"
                    />
                    {partnerPhotos.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {partnerPhotos.length} photo(s) selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Partner Signatures (JPG/PNG)</Label>
                    <Input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => setPartnerSignatures(Array.from(e.target.files || []))}
                      className="mt-1"
                    />
                    {partnerSignatures.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {partnerSignatures.length} signature(s) selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Aadhaar Cards (JPG/PNG/PDF)</Label>
                    <Input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setPartnerAadhaarCards(Array.from(e.target.files || []))}
                      className="mt-1"
                    />
                    {partnerAadhaarCards.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {partnerAadhaarCards.length} Aadhaar card(s) selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>PAN Cards (JPG/PNG/PDF)</Label>
                    <Input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setPartnerPanCards(Array.from(e.target.files || []))}
                      className="mt-1"
                    />
                    {partnerPanCards.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {partnerPanCards.length} PAN card(s) selected
                      </p>
                    )}
                  </div>
                </div>

                {/* Business Address Proof Documents */}
                <div className="space-y-4">
                  <h4 className="font-medium">Business Address Proof Documents</h4>
                  
                  <div>
                    <Label>Rent Agreement (PDF)</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setRentAgreement(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                    {rentAgreement && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {rentAgreement.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Electricity Bill (PDF)</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setElectricityBill(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                    {electricityBill && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {electricityBill.name} selected
                      </p>
                    )}
                  </div>

                  {addressProofType === "rent" && (
                    <div>
                      <Label>Owner's PAN/Aadhaar (PDF)</Label>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setOwnerPanAadhaar(e.target.files?.[0] || null)}
                        className="mt-1"
                      />
                      {ownerPanAadhaar && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ {ownerPanAadhaar.name} selected
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label>Municipal Tax Receipt (PDF)</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setMunicipalTaxReceipt(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                    {municipalTaxReceipt && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {municipalTaxReceipt.name} selected
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Documents */}
                <div className="space-y-4">
                  <h4 className="font-medium">Additional Documents</h4>
                  
                  <div>
                    <Label>Any Other Documents (Excel, Zip, Pdf, Word)</Label>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
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

                  {/* Custom Documents */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Add Custom Documents</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addCustomDoc}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    {customDocs.length > 0 && (
                      <div className="space-y-3">
                        {customDocs.map((cd, idx) => (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                            <Input
                              placeholder="Document Title"
                              value={cd.title}
                              onChange={(e) => updateCustomDocTitle(idx, e.target.value)}
                            />
                            <Input
                              type="file"
                              onChange={(e) => updateCustomDocFile(idx, e.target.files?.[0] || null)}
                            />
                            <Button type="button" variant="ghost" onClick={() => removeCustomDoc(idx)}>
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
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
                    Submit Partnership Firm Registration
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
