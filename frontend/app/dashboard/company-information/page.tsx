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
import { Loader2, Upload, ArrowLeft, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { API_PATHS } from "@/lib/api-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const companyFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  companyType: z.string().min(1, "Company type is required"),
  proposedName1: z.string().min(1, "First proposed company name is required"),
  proposedName2: z.string().min(1, "Second proposed company name is required"),
  businessDetails: z.string().min(1, "Business details are required"),
  businessActivity: z.string().min(1, "Business activity is required"),
  proposedCapital: z.string().min(1, "Proposed capital is required"),
  registeredOfficeAddress: z.string().min(1, "Registered office address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 digits"),
  addressProofType: z.enum(["rent", "owned"], { required_error: "Please select address proof type" }),
  ownerName: z.string().optional(),
  ownerPan: z.string().optional(),
  ownerAadhaar: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface Director {
  name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaar: string;
  voterId: string;
  drivingLicense: string;
  address: string;
  bankStatement: File | null;
}

const COMPANY_TYPE_NAMES: Record<string, string> = {
  "Private Limited Company": "Private Limited Company",
  "Public Limited Company": "Public Limited Company",
  "One Person Company": "One Person Company",
  "Section 8 Company": "Section 8 Company",
  "Nidhi Company": "Nidhi Company",
  "Producer Company": "Producer Company",
  "private-limited": "Private Limited Company",
  "public-limited": "Public Limited Company",
  "one-person-company": "One Person Company",
  "section-8": "Section 8 Company",
  "nidhi-company": "Nidhi Company",
  "producer-company": "Producer Company",
};

export default function CompanyFormationPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [directors, setDirectors] = useState<Director[]>([
    { name: "", email: "", phone: "", pan: "", aadhaar: "", voterId: "", drivingLicense: "", address: "", bankStatement: null }
  ]);
  
  // Document states for each director
  const [directorPhotos, setDirectorPhotos] = useState<File[][]>([[]]);
  const [directorSignatures, setDirectorSignatures] = useState<File[][]>([[]]);
  const [directorAadhaarCards, setDirectorAadhaarCards] = useState<File[][]>([[]]);
  const [directorPanCards, setDirectorPanCards] = useState<File[][]>([[]]);
  const [directorVoterIds, setDirectorVoterIds] = useState<File[][]>([[]]);
  const [directorDrivingLicenses, setDirectorDrivingLicenses] = useState<File[][]>([[]]);
  
  // Company address documents
  const [rentAgreement, setRentAgreement] = useState<File | null>(null);
  const [electricityBill, setElectricityBill] = useState<File | null>(null);
  const [ownerPanAadhaar, setOwnerPanAadhaar] = useState<File | null>(null);
  const [municipalTaxReceipt, setMunicipalTaxReceipt] = useState<File | null>(null);
  
  // Other documents
  const [otherDocuments, setOtherDocuments] = useState<File[]>([]);
  
  // Get company type from URL
  const serviceParam = searchParams?.get("service") || "";
  const companyTypeName = COMPANY_TYPE_NAMES[serviceParam] || "Company Formation";
  const companyTypeValue = serviceParam.toLowerCase().replace(/\s+/g, "-") || "";

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      pan: "",
      companyType: companyTypeValue || "",
      proposedName1: "",
      proposedName2: "",
      businessDetails: "",
      businessActivity: "",
      proposedCapital: "",
      registeredOfficeAddress: "",
      city: "",
      state: "",
      pincode: "",
      addressProofType: "owned",
      ownerName: "",
      ownerPan: "",
      ownerAadhaar: "",
    },
  });

  // Update form when user data is available
  useEffect(() => {
    if (user) {
      const currentValues = form.getValues();
      const formData: Partial<CompanyFormValues> = {};
      let hasChanges = false;
      
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
      
      if (hasChanges) {
        form.reset({
          ...currentValues,
          ...formData,
        });
      }
    }
  }, [user]);

  // Set company type from URL
  useEffect(() => {
    if (companyTypeValue) {
      form.setValue("companyType", companyTypeValue);
    }
  }, [companyTypeValue, form]);

  const isFieldDisabled = (fieldName: keyof CompanyFormValues) => {
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

  const addDirector = () => {
    setDirectors([...directors, { name: "", email: "", phone: "", pan: "", aadhaar: "", voterId: "", drivingLicense: "", address: "", bankStatement: null }]);
    setDirectorPhotos([...directorPhotos, []]);
    setDirectorSignatures([...directorSignatures, []]);
    setDirectorAadhaarCards([...directorAadhaarCards, []]);
    setDirectorPanCards([...directorPanCards, []]);
    setDirectorVoterIds([...directorVoterIds, []]);
    setDirectorDrivingLicenses([...directorDrivingLicenses, []]);
  };

  const removeDirector = (index: number) => {
    if (directors.length > 1) {
      setDirectors(directors.filter((_, i) => i !== index));
      setDirectorPhotos(directorPhotos.filter((_, i) => i !== index));
      setDirectorSignatures(directorSignatures.filter((_, i) => i !== index));
      setDirectorAadhaarCards(directorAadhaarCards.filter((_, i) => i !== index));
      setDirectorPanCards(directorPanCards.filter((_, i) => i !== index));
      setDirectorVoterIds(directorVoterIds.filter((_, i) => i !== index));
      setDirectorDrivingLicenses(directorDrivingLicenses.filter((_, i) => i !== index));
    }
  };

  const updateDirector = (index: number, field: keyof Director, value: string | File | null) => {
    const updatedDirectors = [...directors];
    if (field === 'bankStatement') {
      updatedDirectors[index][field] = value as File | null;
    } else {
      updatedDirectors[index][field] = value as string;
    }
    setDirectors(updatedDirectors);
  };

  const updateDirectorFiles = (index: number, fileType: string, files: File[]) => {
    switch (fileType) {
      case "photo":
        const newPhotos = [...directorPhotos];
        newPhotos[index] = files;
        setDirectorPhotos(newPhotos);
        break;
      case "signature":
        const newSignatures = [...directorSignatures];
        newSignatures[index] = files;
        setDirectorSignatures(newSignatures);
        break;
      case "aadhaar":
        const newAadhaar = [...directorAadhaarCards];
        newAadhaar[index] = files;
        setDirectorAadhaarCards(newAadhaar);
        break;
      case "pan":
        const newPan = [...directorPanCards];
        newPan[index] = files;
        setDirectorPanCards(newPan);
        break;
      case "voterId":
        const newVoterId = [...directorVoterIds];
        newVoterId[index] = files;
        setDirectorVoterIds(newVoterId);
        break;
      case "drivingLicense":
        const newDL = [...directorDrivingLicenses];
        newDL[index] = files;
        setDirectorDrivingLicenses(newDL);
        break;
    }
  };

  const addressProofType = form.watch("addressProofType");

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const formValue = typeof value === 'boolean' ? String(value) : (typeof value === 'string' ? value : String(value));
          formData.append(key, formValue);
        }
      });

      // Append directors data
      formData.append("directors", JSON.stringify(directors));

      // Append service and subService
      formData.append("service", "Company Formation");
      formData.append("subService", companyTypeName);

      // Append director documents
      directors.forEach((director, dirIndex) => {
        if (directorPhotos[dirIndex]) {
          directorPhotos[dirIndex].forEach((file) => {
            formData.append(`directorPhoto_${dirIndex}`, file);
          });
        }
        if (directorSignatures[dirIndex]) {
          directorSignatures[dirIndex].forEach((file) => {
            formData.append(`directorSignature_${dirIndex}`, file);
          });
        }
        if (directorAadhaarCards[dirIndex]) {
          directorAadhaarCards[dirIndex].forEach((file) => {
            formData.append(`directorAadhaar_${dirIndex}`, file);
          });
        }
        if (directorPanCards[dirIndex]) {
          directorPanCards[dirIndex].forEach((file) => {
            formData.append(`directorPan_${dirIndex}`, file);
          });
        }
        if (directorVoterIds[dirIndex]) {
          directorVoterIds[dirIndex].forEach((file) => {
            formData.append(`directorVoterId_${dirIndex}`, file);
          });
        }
        if (directorDrivingLicenses[dirIndex]) {
          directorDrivingLicenses[dirIndex].forEach((file) => {
            formData.append(`directorDrivingLicense_${dirIndex}`, file);
          });
        }
        if (director.bankStatement) {
          formData.append(`directorBankStatement_${dirIndex}`, director.bankStatement);
        }
      });

      // Append company address documents
      if (rentAgreement) formData.append("rentAgreement", rentAgreement);
      if (electricityBill) formData.append("electricityBill", electricityBill);
      if (ownerPanAadhaar) formData.append("ownerPanAadhaar", ownerPanAadhaar);
      if (municipalTaxReceipt) formData.append("municipalTaxReceipt", municipalTaxReceipt);

      // Append other documents
      otherDocuments.forEach((file) => {
        formData.append("documents", file);
      });

      // Map form fields to backend expected fields
      formData.append("companyName", data.proposedName1); // Use first proposed name as primary
      formData.append("proposedNames", JSON.stringify([data.proposedName1, data.proposedName2]));

      await api.post(API_PATHS.FORMS.COMPANY_FORMATION, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`${companyTypeName} registration application submitted successfully`);
      router.push("/dashboard/company-information");
    } catch (error) {
      console.error("Failed to submit company formation form:", error);
      toast.error("Failed to submit company formation application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-2xl font-bold">{companyTypeName} Registration</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{companyTypeName} Registration Form</CardTitle>
          <CardDescription>
            Submit your {companyTypeName.toLowerCase()} registration application with all required details and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Primary Applicant Information */}
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

              {/* Company Proposed Names */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Proposed Names</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    Please provide 2 proposed names for your company. Any one of them will be approved.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="proposedName1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Company Name 1 *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter first proposed company name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proposedName2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Company Name 2 *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter second proposed company name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Directors Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Directors Information</h3>
                  <Button type="button" variant="outline" onClick={addDirector}>
                    <Plus className="h-4 w-4 mr-2" /> Add Director
                  </Button>
                </div>
                {directors.map((director, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Director {index + 1}</h4>
                      {directors.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDirector(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={director.name}
                          onChange={(e) => updateDirector(index, "name", e.target.value)}
                          placeholder="Director name"
                        />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={director.email}
                          onChange={(e) => updateDirector(index, "email", e.target.value)}
                          placeholder="Director email"
                        />
                      </div>
                      <div>
                        <Label>Phone *</Label>
                        <Input
                          value={director.phone}
                          onChange={(e) => updateDirector(index, "phone", e.target.value)}
                          placeholder="Director phone"
                        />
                      </div>
                        <div>
                          <Label>PAN *</Label>
                          <Input
                            value={director.pan}
                            onChange={(e) => updateDirector(index, "pan", e.target.value.toUpperCase() as string)}
                            placeholder="ABCDE1234F"
                          />
                        </div>
                      <div>
                        <Label>Aadhaar *</Label>
                        <Input
                          value={director.aadhaar}
                          onChange={(e) => updateDirector(index, "aadhaar", e.target.value.replace(/\D/g, ""))}
                          placeholder="123456789012"
                          maxLength={12}
                        />
                      </div>
                      <div>
                        <Label>Voter ID</Label>
                        <Input
                          value={director.voterId}
                          onChange={(e) => updateDirector(index, "voterId", e.target.value)}
                          placeholder="Voter ID number"
                        />
                      </div>
                      <div>
                        <Label>Driving License</Label>
                        <Input
                          value={director.drivingLicense}
                          onChange={(e) => updateDirector(index, "drivingLicense", e.target.value)}
                          placeholder="Driving License number"
                        />
                      </div>
                      <div>
                        <Label>Address *</Label>
                        <Textarea
                          value={director.address}
                          onChange={(e) => updateDirector(index, "address", e.target.value)}
                          placeholder="Director address"
                          rows={2}
                        />
                      </div>
                    </div>
                    
                    {/* Director KYC Documents */}
                    <div className="mt-4 space-y-3 border-t pt-4">
                      <h5 className="font-medium text-sm">Director {index + 1} KYC Documents</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Photo (JPG/PNG)</Label>
                          <Input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => updateDirectorFiles(index, "photo", Array.from(e.target.files || []))}
                            className="mt-1"
                          />
                          {directorPhotos[index]?.length > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {directorPhotos[index].length} photo(s) selected
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Signature (JPG/PNG)</Label>
                          <Input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => updateDirectorFiles(index, "signature", Array.from(e.target.files || []))}
                            className="mt-1"
                          />
                          {directorSignatures[index]?.length > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {directorSignatures[index].length} signature(s) selected
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Aadhaar Card (JPG/PNG/PDF)</Label>
                          <Input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updateDirectorFiles(index, "aadhaar", Array.from(e.target.files || []))}
                            className="mt-1"
                          />
                          {directorAadhaarCards[index]?.length > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {directorAadhaarCards[index].length} Aadhaar card(s) selected
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>PAN Card (JPG/PNG/PDF)</Label>
                          <Input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updateDirectorFiles(index, "pan", Array.from(e.target.files || []))}
                            className="mt-1"
                          />
                          {directorPanCards[index]?.length > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {directorPanCards[index].length} PAN card(s) selected
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Voter ID (JPG/PNG/PDF)</Label>
                          <Input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updateDirectorFiles(index, "voterId", Array.from(e.target.files || []))}
                            className="mt-1"
                          />
                          {directorVoterIds[index]?.length > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {directorVoterIds[index].length} Voter ID(s) selected
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Driving License (JPG/PNG/PDF)</Label>
                          <Input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => updateDirectorFiles(index, "drivingLicense", Array.from(e.target.files || []))}
                            className="mt-1"
                          />
                          {directorDrivingLicenses[index]?.length > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {directorDrivingLicenses[index].length} Driving License(s) selected
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Bank Statement (Latest 3 Months) (PDF)</Label>
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => updateDirector(index, "bankStatement", e.target.files?.[0] || null)}
                            className="mt-1"
                          />
                          {director.bankStatement && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {director.bankStatement.name} selected
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Company Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="registeredOfficeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Office Address *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Enter complete registered office address" />
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

              {/* Company Address Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Address Proof Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Rent Agreement (JPG/PNG/PDF)</Label>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
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
                    <Label>Electricity Bill (JPG/PNG/PDF)</Label>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
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
                      <Label>Owner PAN/Aadhaar Card (JPG/PNG/PDF)</Label>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
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
                    <Label>Municipal Tax Receipt (JPG/PNG/PDF)</Label>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
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
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessActivity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Activity *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Describe your business activity" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proposedCapital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Capital *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter proposed capital amount" />
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
                      <FormLabel>Business Details *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="Provide detailed information about your business" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Other Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Any Other Documents</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    Upload any additional documents (Excel, Zip, Pdf, Word)
                  </p>
                </div>
                <div>
                  <Label>Additional Documents (Excel, Zip, Pdf, Word)</Label>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                    onChange={(e) => setOtherDocuments(Array.from(e.target.files || []))}
                    className="mt-1"
                  />
                  {otherDocuments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {otherDocuments.map((file, index) => (
                        <div key={index} className="flex items-center text-sm text-green-600">
                          <FileText className="h-4 w-4 mr-2" />
                          ✓ {file.name}
                        </div>
                      ))}
                    </div>
                  )}
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
                    Submit {companyTypeName} Registration
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
