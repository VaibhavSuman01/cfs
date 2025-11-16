"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, FileText, Edit3, Save, AlertCircle, Building, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api, { API_PATHS } from "@/lib/api-client";
import { toast } from "sonner";

const schema = z.object({
  proposedName1: z.string().min(1, "First proposed company name is required"),
  proposedName2: z.string().min(1, "Second proposed company name is required"),
  businessDetails: z.string().min(1, "Business details are required"),
  businessActivity: z.string().min(1, "Business activity is required"),
  registeredOfficeAddress: z.string().min(1, "Registered office address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 digits"),
  addressProofType: z.enum(["rent", "owned"], { required_error: "Please select address proof type" }),
  ownerName: z.string().optional(),
  ownerPan: z.string().optional(),
  ownerAadhaar: z.string().optional(),
});

type Values = z.infer<typeof schema>;

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

export default function CompanyFormationEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => (params?.id as string) || "", [params]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      proposedName1: "",
      proposedName2: "",
      businessDetails: "",
      businessActivity: "",
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Directors state
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

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(API_PATHS.FORMS.COMPANY_FORMATION_DETAIL(id));
        const data = res.data?.data || res.data || {};
        
        // Parse proposed names if stored as array
        const proposedNames = data.proposedNames ? 
          (Array.isArray(data.proposedNames) ? data.proposedNames : JSON.parse(data.proposedNames || "[]")) : 
          [data.companyName || "", ""];
        
        form.reset({
          proposedName1: proposedNames[0] || data.companyName || "",
          proposedName2: proposedNames[1] || "",
          businessDetails: data.businessDetails || "",
          businessActivity: data.businessActivity || "",
          registeredOfficeAddress: data.registeredOfficeAddress || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          addressProofType: data.addressProofType || "owned",
          ownerName: data.ownerName || "",
          ownerPan: data.ownerPan || "",
          ownerAadhaar: data.ownerAadhaar || "",
        });

        // Load directors if available
        if (data.directors) {
          const directorsData = typeof data.directors === 'string' ? JSON.parse(data.directors) : data.directors;
          if (Array.isArray(directorsData) && directorsData.length > 0) {
            setDirectors(directorsData.map((d: any) => ({
              name: d.name || "",
              email: d.email || "",
              phone: d.phone || "",
              pan: d.pan || "",
              aadhaar: d.aadhaar || "",
              voterId: d.voterId || "",
              drivingLicense: d.drivingLicense || "",
              address: d.address || "",
              bankStatement: null,
            })));
            // Initialize document arrays for each director
            setDirectorPhotos(new Array(directorsData.length).fill([]));
            setDirectorSignatures(new Array(directorsData.length).fill([]));
            setDirectorAadhaarCards(new Array(directorsData.length).fill([]));
            setDirectorPanCards(new Array(directorsData.length).fill([]));
            setDirectorVoterIds(new Array(directorsData.length).fill([]));
            setDirectorDrivingLicenses(new Array(directorsData.length).fill([]));
          }
        }
      } catch (e) {
        console.error("Failed to load form detail", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, form]);

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

  const onSubmit = async (values: Values) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      
      // Append form data
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const formValue = typeof value === 'boolean' ? String(value) : (typeof value === 'string' ? value : String(value));
          formData.append(key, formValue);
        }
      });

      // Append directors data
      formData.append("directors", JSON.stringify(directors));

      // Append proposed names
      formData.append("companyName", values.proposedName1);
      formData.append("proposedNames", JSON.stringify([values.proposedName1, values.proposedName2]));

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

      await api.put(API_PATHS.FORMS.COMPANY_FORMATION_UPDATE(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Form updated successfully");
      router.push(`/dashboard/company-information/${id}`);
    } catch (e) {
      console.error("Failed to update form", e);
      toast.error("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="h-8 w-8 text-blue-600" />
              Edit Company Information
            </h1>
            <p className="text-gray-600 mt-1">Update your Company Information application details and upload additional documents</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Information Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You can update your Company Information details and upload additional documents. Existing documents cannot be deleted.
          </AlertDescription>
        </Alert>

        {/* Main Form Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Edit3 className="h-6 w-6 text-blue-600" />
              Update Company Information Details
            </CardTitle>
            <CardDescription>Modify your Company Information information and add supporting documents</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* 1. Directors KYC Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">1. Directors KYC (Upload as Jpeg/Jpg/Pdf/Png)</h3>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">Add or update director information and documents</p>
                    <Button type="button" variant="outline" onClick={addDirector}>
                      <Plus className="h-4 w-4 mr-2" /> Add Director
                    </Button>
                  </div>
                  {directors.map((director, index) => (
                    <Card key={index} className="p-4 border-2">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-lg">Director {index + 1}</h4>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Name *</Label>
                          <Input
                            value={director.name}
                            onChange={(e) => updateDirector(index, "name", e.target.value)}
                            placeholder="Director name"
                          />
                        </div>
                        <div>
                          <Label>Email (Text) *</Label>
                          <Input
                            type="email"
                            value={director.email}
                            onChange={(e) => updateDirector(index, "email", e.target.value)}
                            placeholder="Director email"
                          />
                        </div>
                        <div>
                          <Label>Mobile No. (Text) *</Label>
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
                            onChange={(e) => updateDirector(index, "pan", e.target.value.toUpperCase())}
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
                            <Label>a. Photo (Jpeg/Jpg/Pdf/Png)</Label>
                            <Input
                              type="file"
                              multiple
                              accept=".jpg,.jpeg,.png,.pdf"
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
                            <Label>b. Signature (Jpeg/Jpg/Pdf/Png)</Label>
                            <Input
                              type="file"
                              multiple
                              accept=".jpg,.jpeg,.png,.pdf"
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
                            <Label>c. Aadhar Card (Jpeg/Jpg/Pdf/Png)</Label>
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
                            <Label>d. Pan Card (Jpeg/Jpg/Pdf/Png)</Label>
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
                            <Label>e. Voter ID (Jpeg/Jpg/Pdf/Png)</Label>
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
                            <Label>e. Driving Licence (Jpeg/Jpg/Pdf/Png)</Label>
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
                            <Label>h. Bank Statement (latest 3 Months) (Pdf)</Label>
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

                {/* 2. Company Proposed Names */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">2. Company Proposed Name (2 proposed name of Company required, any one of them will be approved)</h3>
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

                {/* 3. Company Address */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">3. Company Address (Upload as Jpeg/Jpg/Pdf/Png)</h3>
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

                  {/* Company Address Documents */}
                  <div className="mt-4 space-y-4">
                    <h5 className="font-medium text-sm">Company Address Proof Documents</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>a. Rent Agreement (Jpeg/Jpg/Pdf/Png)</Label>
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
                        <Label>b. Electricity Bill (Jpeg/Jpg/Pdf/Png)</Label>
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
                          <Label>c. Owner Pan/Aadhar card (if rented) (Jpeg/Jpg/Pdf/Png)</Label>
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
                        <Label>d. Municipal Tax Receipt of property (Jpeg/Jpg/Pdf/Png)</Label>
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
                  </div>

                {/* 4. Business Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">4. Business Detail (Text Box)</h3>
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

                {/* 5. Any Other Documents */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">5. Any Other Documents (Excel,Zip,Pdf,Word)</h3>
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

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="px-8 bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}