'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, FileText, Upload, ArrowLeft, Plus, Trash2, Building2, Users } from 'lucide-react';
import { toast } from 'sonner';
import api, { API_PATHS } from '@/lib/api-client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const companyFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  service: z.string().min(1, 'Please select a service'),
  companyName: z.string().min(1, 'Company name is required'),
  businessActivity: z.string().min(1, 'Business activity is required'),
  proposedCapital: z.string().min(1, 'Proposed capital is required'),
  registeredOfficeAddress: z.string().min(1, 'Registered office address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 digits'),
  hasDigitalSignature: z.boolean().optional(),
  hasBankAccount: z.boolean().optional(),
  requiresGstRegistration: z.boolean().optional(),
  requiresCompliance: z.boolean().optional(),
  selectedPackage: z.string().min(1, 'Please select a package'),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompanyFormationFormPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [customDocs, setCustomDocs] = useState<Array<{ title: string; file: File | null }>>([]);
  const [directors, setDirectors] = useState<Array<{
    name: string;
    pan: string;
    aadhaar: string;
    email: string;
    phone: string;
    address: string;
    nationality: string;
    isResident: boolean;
    din: string;
  }>>([{
    name: '',
    pan: '',
    aadhaar: '',
    email: '',
    phone: '',
    address: '',
    nationality: 'Indian',
    isResident: true,
    din: '',
  }]);

  // Suggested required documents by service
  const serviceDocMap: Record<string, string[]> = useMemo(() => ({
    'Private Limited Company': [
      'PAN Card of all Directors',
      'Aadhaar Card of all Directors',
      'Passport size photographs',
      'Address proof (Passport/Driving License/Voter ID)',
      'Utility bill of registered office',
      'Rent agreement (if rented)',
      'NOC from property owner',
    ],
    'One Person Company (OPC)': [
      'PAN Card of Director',
      'Aadhaar Card of Director',
      'Passport size photographs',
      'Address proof',
      'Utility bill of registered office',
      'Rent agreement (if rented)',
      'NOC from property owner',
    ],
    'Public Limited Company': [
      'PAN Card of all Directors',
      'Aadhaar Card of all Directors',
      'Passport size photographs',
      'Address proof',
      'Utility bill of registered office',
      'Rent agreement (if rented)',
      'NOC from property owner',
    ],
    'Nidhi Company': [
      'PAN Card of all Directors',
      'Aadhaar Card of all Directors',
      'Passport size photographs',
      'Address proof',
      'Utility bill of registered office',
      'Rent agreement (if rented)',
      'NOC from property owner',
    ],
    'Section 8 Company': [
      'PAN Card of all Directors',
      'Aadhaar Card of all Directors',
      'Passport size photographs',
      'Address proof',
      'Utility bill of registered office',
      'Rent agreement (if rented)',
      'NOC from property owner',
    ],
  }), []);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      pan: user?.pan || '',
      service: '',
      companyName: '',
      businessActivity: '',
      proposedCapital: '',
      registeredOfficeAddress: '',
      city: '',
      state: '',
      pincode: '',
      hasDigitalSignature: false,
      hasBankAccount: false,
      requiresGstRegistration: false,
      requiresCompliance: false,
      selectedPackage: 'Basic',
    },
  });

  const selectedService = form.watch('service');

  // Preselect service from query param
  useEffect(() => {
    const qpService = searchParams.get('service');
    if (qpService) {
      form.setValue('service', qpService);
    }
  }, [searchParams, form]);

  const addDirector = () => {
    setDirectors(prev => [...prev, {
      name: '',
      pan: '',
      aadhaar: '',
      email: '',
      phone: '',
      address: '',
      nationality: 'Indian',
      isResident: true,
      din: '',
    }]);
  };

  const removeDirector = (index: number) => {
    if (directors.length > 1) {
      setDirectors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateDirector = (index: number, field: string, value: string | boolean) => {
    setDirectors(prev => prev.map((dir, i) => 
      i === index ? { ...dir, [field]: value } : dir
    ));
  };

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          formData.append(key, String(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        } else {
          // Append empty string for undefined/null values to ensure all fields are sent
          formData.append(key, '');
        }
      });

      // Debug: Log what's being sent
      console.log('Form data being sent:', data);
      console.log('Directors data:', directors);
      
      // Append directors data
      formData.append('directors', JSON.stringify(directors));

      // Append files
      let fileIndex = 0;
      files.forEach((file) => {
        const fileId = `file_${fileIndex}`;
        formData.append('documents', file);
        formData.append(`fileId_${fileIndex}`, fileId);
        fileIndex += 1;
      });

      customDocs.forEach((entry) => {
        if (entry.file) {
          const fileId = `file_${fileIndex}`;
          formData.append('documents', entry.file);
          formData.append(`fileId_${fileIndex}`, fileId);
          formData.append(`documentType_file_${fileIndex}`, entry.title || entry.file.name);
          fileIndex += 1;
        }
      });

      await api.post(API_PATHS.FORMS.COMPANY_FORMATION, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Company formation form submitted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to submit company formation form:', error);
      toast.error('Failed to submit company formation form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCustomDoc = () => {
    setCustomDocs(prev => [...prev, { title: '', file: null }]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Company Formation Form</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Company Formation Application</CardTitle>
          <CardDescription>Fill in the details for your company formation service</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="pan" render={({ field }) => (<FormItem><FormLabel>PAN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Private Limited Company">Private Limited Company</SelectItem>
                            <SelectItem value="One Person Company (OPC)">One Person Company (OPC)</SelectItem>
                            <SelectItem value="Public Limited Company">Public Limited Company</SelectItem>
                            <SelectItem value="Nidhi Company">Nidhi Company</SelectItem>
                            <SelectItem value="Section 8 Company">Section 8 Company</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="selectedPackage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Selection</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a package" />
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
              </div>

              {/* Company Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Proposed Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="businessActivity" render={({ field }) => (<FormItem><FormLabel>Business Activity</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="proposedCapital" render={({ field }) => (<FormItem><FormLabel>Proposed Capital</FormLabel><FormControl><Input {...field} placeholder="e.g., ₹10,00,000" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="registeredOfficeAddress" render={({ field }) => (<FormItem><FormLabel>Registered Office Address</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="pincode" render={({ field }) => (<FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>

              {/* Directors Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Directors Information</h3>
                  <Button type="button" variant="secondary" size="sm" onClick={addDirector}>
                    <Plus className="h-4 w-4 mr-1" /> Add Director
                  </Button>
                </div>
                {directors.map((director, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Director {index + 1}</h4>
                      {directors.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeDirector(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={director.name}
                          onChange={(e) => updateDirector(index, 'name', e.target.value)}
                          placeholder="Director Name"
                        />
                      </div>
                      <div>
                        <Label>PAN</Label>
                        <Input
                          value={director.pan}
                          onChange={(e) => updateDirector(index, 'pan', e.target.value)}
                          placeholder="PAN Number"
                        />
                      </div>
                      <div>
                        <Label>Aadhaar</Label>
                        <Input
                          value={director.aadhaar}
                          onChange={(e) => updateDirector(index, 'aadhaar', e.target.value)}
                          placeholder="Aadhaar Number"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={director.email}
                          onChange={(e) => updateDirector(index, 'email', e.target.value)}
                          type="email"
                          placeholder="Email Address"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={director.phone}
                          onChange={(e) => updateDirector(index, 'phone', e.target.value)}
                          placeholder="Phone Number"
                        />
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Input
                          value={director.address}
                          onChange={(e) => updateDirector(index, 'address', e.target.value)}
                          placeholder="Residential Address"
                        />
                      </div>
                      <div>
                        <Label>Nationality</Label>
                        <Select value={director.nationality} onValueChange={(value) => updateDirector(index, 'nationality', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Indian">Indian</SelectItem>
                            <SelectItem value="Foreign">Foreign</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={director.isResident}
                          onCheckedChange={(checked) => updateDirector(index, 'isResident', checked)}
                        />
                        <Label>Indian Resident</Label>
                      </div>
                      <div>
                        <Label>DIN (if available)</Label>
                        <Input
                          value={director.din}
                          onChange={(e) => updateDirector(index, 'din', e.target.value)}
                          placeholder="Director Identification Number"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hasDigitalSignature"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Do you have Digital Signature Certificate (DSC)?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasBankAccount"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Do you need Bank Account setup assistance?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requiresGstRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Do you need GST Registration?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requiresCompliance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Do you need Compliance setup?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Suggested Documents */}
              {selectedService && serviceDocMap[selectedService] && (
                <div className="space-y-2">
                  <Label>Suggested Documents for {selectedService}</Label>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground">
                    {serviceDocMap[selectedService].map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Supporting Documents</Label>
                <div className="flex items-center">
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                  <span className="ml-4 text-sm text-muted-foreground">
                    {files.length} {files.length === 1 ? 'file' : 'files'} selected
                  </span>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Documents */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Add Custom Documents (title + file)</Label>
                  <Button type="button" variant="secondary" size="sm" onClick={addCustomDoc}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                {customDocs.length > 0 && (
                  <div className="space-y-3">
                    {customDocs.map((cd, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <Input
                          placeholder="Document Title (e.g., Additional Proof)"
                          value={cd.title}
                          onChange={(e) => updateCustomDocTitle(idx, e.target.value)}
                        />
                        <Input
                          type="file"
                          onChange={(e) => updateCustomDocFile(idx, e.target.files?.[0] || null)}
                        />
                        <Button type="button" variant="ghost" onClick={() => removeCustomDoc(idx)} className="md:justify-self-start">
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Company Formation Form'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
