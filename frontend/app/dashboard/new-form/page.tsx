'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, FileText, Upload, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api-client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const taxFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits').optional(),
  service: z.string().min(1, 'Please select a service'),
  year: z.string().min(4, 'Please select a financial year'),
  hasIncomeTaxLogin: z.boolean().optional(),
  incomeTaxLoginId: z.string().optional(),
  incomeTaxLoginPassword: z.string().optional(),
  hasHomeLoan: z.boolean().optional(),
  homeLoanSanctionDate: z.string().optional(),
  homeLoanAmount: z.string().optional(),
  homeLoanCurrentDue: z.string().optional(),
  homeLoanTotalInterest: z.string().optional(),
  hasPranNumber: z.boolean().optional(),
  pranNumber: z.string().optional(),
  
  // GST Filing specific fields
  gstFilingMonth: z.string().optional(),
  gstFilingYear: z.string().optional(),
  gstNumber: z.string().optional(),
  
  // TDS Return specific fields
  tdsFilingMonth: z.string().optional(),
  tdsFilingYear: z.string().optional(),
  tracesUserId: z.string().optional(),
  tracesPassword: z.string().optional(),
  tanNumber: z.string().optional(),
  incomeTaxUserId: z.string().optional(),
  incomeTaxPassword: z.string().optional(),
  panNumber: z.string().optional(),
  
  // EPFO specific fields
  epfoUserId: z.string().optional(),
  epfoPassword: z.string().optional(),
  
  // ESIC specific fields
  esicUserId: z.string().optional(),
  esicPassword: z.string().optional(),
  
  // PT-Tax specific fields
  ptTaxUserId: z.string().optional(),
  ptTaxPassword: z.string().optional(),
});

type TaxFormValues = z.infer<typeof taxFormSchema>;

export default function NewFormPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [customDocs, setCustomDocs] = useState<Array<{ title: string; file: File | null }>>([]);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  
  // Service-specific document states
  const [salesDataFile, setSalesDataFile] = useState<File | null>(null);
  const [purchaseDataFile, setPurchaseDataFile] = useState<File | null>(null);
  const [bankStatementFile, setBankStatementFile] = useState<File | null>(null);
  const [tdsDataFile, setTdsDataFile] = useState<File | null>(null);
  const [wagesReportFile, setWagesReportFile] = useState<File | null>(null);
  const [salarySheetFile, setSalarySheetFile] = useState<File | null>(null);

  // Month and year options
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const years = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
  ];

  // Suggested required documents by service
  const serviceDocMap: Record<string, string[]> = useMemo(() => ({
    'GST Filing': [
      'Sales Data (Tally Data) - zip/excel',
      'Bank Statement (Tally Data)',
      'Purchase Data (Tally Data)',
      'Any other documents (Excel, Zip, Pdf, Word)',
    ],
    'Income Tax Filing': [
      'Form 16 / 16A / 16B',
      'Form 26AS/AIS/TIS',
      'Interest Certificates',
      'Capital Gains Statements',
      'Investment Proofs (LIC/PPF/ELSS/NPS)',
      'Donation Receipts',
      'Bank Details / Cancelled Cheque',
      'Previous ITR (optional)',
    ],
    'TDS Returns': [
      'TRACES User ID & Password (Text format)',
      'Income Tax User ID & Password (Text format)',
      'TDS Data (Monthly) - Excel/Zip/Pdf/Word',
      'Any other documents (Excel, Zip, Pdf, Word)',
    ],
    'EPFO Filing': [
      'EPFO User ID & Password (Text format)',
      'Wages Report / Calculation of monthly wages - Excel/Zip/Pdf/Word',
      'Salary Sheet of all Employed - Excel/Zip/Pdf/Word',
    ],
    'ESIC Filing': [
      'ESIC User ID & Password (Text format)',
      'Wages Report / Calculation of monthly wages - Excel/Zip/Pdf/Word',
      'Salary Sheet of all Employed - Excel/Zip/Pdf/Word',
      'Any other documents (Excel, Zip, Pdf, Word)',
    ],
    'PT-Tax Filing': [
      'Login Credentials - User ID & Password (Text format)',
      'Wages Report / Calculation of monthly wages - Excel/Zip/Pdf/Word',
      'Salary Sheet of all Employed - Excel/Zip/Pdf/Word',
      'Any other documents (Excel, Zip, Pdf, Word)',
    ],
    'Corporate Tax Filing': [
      'Audited Financial Statements',
      'Tax Audit Report (3CA/3CB & 3CD)',
      'Challan Copies',
      'Form 26AS/AIS',
      'Board Resolutions (if any)',
      'Previous ITR Acknowledgement',
    ],
    'Tax Planning': [
      'Last Year ITR & 26AS',
      'Salary Slips / Form 16',
      'Investment Proofs (FD/PPF/ELSS/Bonds)',
      'Insurance Policies',
      'Loan Statements',
      'Capital Gains Statements',
    ],
    'Payroll Tax': [
      'Salary Register / Payroll Records',
      'Employee Investment Proofs',
      'PF & ESI Challans',
      'TDS Challans (24Q)',
      'Form 16 (Employees)',
    ],
  }), []);

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      pan: '',
      aadhaar: '',
      service: '',
      year: '',
      hasIncomeTaxLogin: false,
      incomeTaxLoginId: '',
      incomeTaxLoginPassword: '',
      hasHomeLoan: false,
      homeLoanSanctionDate: '',
      homeLoanAmount: '',
      homeLoanCurrentDue: '',
      homeLoanTotalInterest: '',
      hasPranNumber: false,
      pranNumber: '',
      // GST Filing specific fields
      gstFilingMonth: '',
      gstFilingYear: '',
      gstNumber: '',
      // TDS Return specific fields
      tdsFilingMonth: '',
      tdsFilingYear: '',
      tracesUserId: '',
      tracesPassword: '',
      tanNumber: '',
      incomeTaxUserId: '',
      incomeTaxPassword: '',
      panNumber: '',
      // EPFO specific fields
      epfoUserId: '',
      epfoPassword: '',
      // ESIC specific fields
      esicUserId: '',
      esicPassword: '',
      // PT-Tax specific fields
      ptTaxUserId: '',
      ptTaxPassword: '',
    },
  });

  const hasIncomeTaxLogin = form.watch('hasIncomeTaxLogin');
  const hasHomeLoan = form.watch('hasHomeLoan');
  const hasPranNumber = form.watch('hasPranNumber');
  const selectedService = form.watch('service');

  // Populate form with user data when loaded
  useEffect(() => {
    if (user && !isLoading) {
      form.setValue('fullName', user.name || '');
      form.setValue('email', user.email || '');
      form.setValue('phone', user.mobile || '');
      form.setValue('pan', user.pan || '');
    }
  }, [user, isLoading, form]);

  // Preselect service from query param
  useEffect(() => {
    const qpService = searchParams.get('service');
    if (qpService) {
      form.setValue('service', qpService);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onSubmit = async (data: TaxFormValues) => {
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

      // Append Aadhaar file if uploaded
      if (aadhaarFile) {
        formData.append('aadhaarFile', aadhaarFile);
      }

      // Append service-specific files
      if (salesDataFile) formData.append('salesDataFile', salesDataFile);
      if (purchaseDataFile) formData.append('purchaseDataFile', purchaseDataFile);
      if (bankStatementFile) formData.append('bankStatementFile', bankStatementFile);
      if (tdsDataFile) formData.append('tdsDataFile', tdsDataFile);
      if (wagesReportFile) formData.append('wagesReportFile', wagesReportFile);
      if (salarySheetFile) formData.append('salarySheetFile', salarySheetFile);

      // Append files with backend-compatible identifiers
      // Backend expects fileId_<index> and optional documentType_<fileId>
      let fileIndex = 0;

      // Regular files (no custom title) -> default documentType handled by backend
      files.forEach((file) => {
        const fileId = `file_${fileIndex}`;
        formData.append('documents', file);
        formData.append(`fileId_${fileIndex}`, fileId);
        fileIndex += 1;
      });

      // Custom titled documents -> send documentType_<fileId> with provided title
      customDocs.forEach((entry) => {
        if (entry.file) {
          const fileId = `file_${fileIndex}`;
          formData.append('documents', entry.file);
          formData.append(`fileId_${fileIndex}`, fileId);
          formData.append(`documentType_${fileId}`, entry.title || entry.file.name);
          fileIndex += 1;
        }
      });

      await api.post('/api/forms/tax', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Tax form submitted successfully');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to submit tax form:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else if (error.response?.status === 409) {
        toast.error("Already submitted for this Year. You can only submit one form per service.");
      } else {
        toast.error('Failed to submit tax form. Please try again.');
      }
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
        <h1 className="text-3xl font-bold">New Tax Form</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a New Tax Form</CardTitle>
          <CardDescription>Fill in the details for your tax filing</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField 
                  control={form.control} 
                  name="pan" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="AAAAA0000A" 
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        Format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
                      </p>
                    </FormItem>
                  )} 
                />
                <FormField 
                  control={form.control} 
                  name="aadhaar" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Number (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="123456789012" 
                          maxLength={12}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        12-digit unique identification number
                      </p>
                    </FormItem>
                  )} 
                />
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GST Filing">GST Filing</SelectItem>
                          <SelectItem value="Income Tax Filing">Income Tax Filing</SelectItem>
                          <SelectItem value="TDS Returns">TDS Returns</SelectItem>
                          <SelectItem value="Tax Planning">Tax Planning</SelectItem>
                          <SelectItem value="EPFO Filing">EPFO Filing</SelectItem>
                          <SelectItem value="ESIC Filing">ESIC Filing</SelectItem>
                          <SelectItem value="PT-Tax Filing">PT-Tax Filing</SelectItem>
                          <SelectItem value="Corporate Tax Filing">Corporate Tax Filing</SelectItem>
                          <SelectItem value="Payroll Tax">Payroll Tax</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financial Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a financial year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2024-25">2024-25</SelectItem>
                          <SelectItem value="2023-24">2023-24</SelectItem>
                          <SelectItem value="2022-23">2022-23</SelectItem>
                          <SelectItem value="2021-22">2021-22</SelectItem>
                          <SelectItem value="2020-21">2020-21</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Suggested documents per service */}
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

              {/* Service-specific fields */}
              {selectedService === 'GST Filing' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">GST Filing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="gstFilingMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Month *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gstFilingYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Year *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year.value} value={year.value}>
                                  {year.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gstNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter GST number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {selectedService === 'TDS Returns' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">TDS Return Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="tdsFilingMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Month *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tdsFilingYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Year *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year.value} value={year.value}>
                                  {year.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tanNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TAN Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter TAN number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tracesUserId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TRACES User ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter TRACES User ID" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tracesPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TRACES Password</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} placeholder="Enter TRACES Password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incomeTaxUserId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Income Tax User ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Income Tax User ID" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incomeTaxPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Income Tax Password</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} placeholder="Enter Income Tax Password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {(selectedService === 'EPFO Filing' || selectedService === 'ESIC Filing' || selectedService === 'PT-Tax Filing') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{selectedService} Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={selectedService === 'EPFO Filing' ? 'epfoUserId' : selectedService === 'ESIC Filing' ? 'esicUserId' : 'ptTaxUserId'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={`Enter ${selectedService} User ID`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={selectedService === 'EPFO Filing' ? 'epfoPassword' : selectedService === 'ESIC Filing' ? 'esicPassword' : 'ptTaxPassword'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} placeholder={`Enter ${selectedService} Password`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Income Tax Filing specific fields */}
              {selectedService === 'Income Tax Filing' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Income Tax Filing Details</h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasIncomeTaxLogin"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Do you have an Income Tax login?</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {hasIncomeTaxLogin && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2">
                        <FormField control={form.control} name="incomeTaxLoginId" render={({ field }) => (<FormItem><FormLabel>Login ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="incomeTaxLoginPassword" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="text" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasHomeLoan"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Do you have a Home Loan?</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {hasHomeLoan && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2">
                        <FormField control={form.control} name="homeLoanSanctionDate" render={({ field }) => (<FormItem><FormLabel>Sanction Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="homeLoanAmount" render={({ field }) => (<FormItem><FormLabel>Loan Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="homeLoanCurrentDue" render={({ field }) => (<FormItem><FormLabel>Current Due</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="homeLoanTotalInterest" render={({ field }) => (<FormItem><FormLabel>Total Interest Paid</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasPranNumber"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Do you have a PRAN Number?</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {hasPranNumber && (
                      <div className="pl-4 border-l-2">
                        <FormField control={form.control} name="pranNumber" render={({ field }) => (<FormItem><FormLabel>PRAN Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Service-specific document uploads */}
              {selectedService === 'GST Filing' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">GST Filing Documents</h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-blue-800">Sales Data (Tally Data)</Label>
                          <p className="text-xs text-blue-600 mt-1">
                            Upload sales data in zip/excel format
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {salesDataFile && (
                            <span className="text-sm text-green-600 font-medium">
                              {salesDataFile.name}
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('sales-data-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {salesDataFile ? 'Change' : 'Upload'}
                          </Button>
                          <input
                            id="sales-data-upload"
                            type="file"
                            accept=".zip,.xlsx,.xls"
                            onChange={(e) => setSalesDataFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          {salesDataFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSalesDataFile(null)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-blue-800">Purchase Data (Tally Data)</Label>
                          <p className="text-xs text-blue-600 mt-1">
                            Upload purchase data in zip/excel format
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {purchaseDataFile && (
                            <span className="text-sm text-green-600 font-medium">
                              {purchaseDataFile.name}
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('purchase-data-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {purchaseDataFile ? 'Change' : 'Upload'}
                          </Button>
                          <input
                            id="purchase-data-upload"
                            type="file"
                            accept=".zip,.xlsx,.xls"
                            onChange={(e) => setPurchaseDataFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          {purchaseDataFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setPurchaseDataFile(null)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-blue-800">Bank Statement (Tally Data)</Label>
                          <p className="text-xs text-blue-600 mt-1">
                            Upload bank statement data in zip/excel format
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {bankStatementFile && (
                            <span className="text-sm text-green-600 font-medium">
                              {bankStatementFile.name}
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('bank-statement-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {bankStatementFile ? 'Change' : 'Upload'}
                          </Button>
                          <input
                            id="bank-statement-upload"
                            type="file"
                            accept=".zip,.xlsx,.xls"
                            onChange={(e) => setBankStatementFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          {bankStatementFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setBankStatementFile(null)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedService === 'TDS Returns' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">TDS Return Documents</h3>
                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-blue-800">TDS Data (Monthly)</Label>
                        <p className="text-xs text-blue-600 mt-1">
                          Upload TDS data in Excel/Zip/Pdf/Word format
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {tdsDataFile && (
                          <span className="text-sm text-green-600 font-medium">
                            {tdsDataFile.name}
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('tds-data-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {tdsDataFile ? 'Change' : 'Upload'}
                        </Button>
                        <input
                          id="tds-data-upload"
                          type="file"
                          accept=".xlsx,.xls,.zip,.pdf,.doc,.docx"
                          onChange={(e) => setTdsDataFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        {tdsDataFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setTdsDataFile(null)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(selectedService === 'EPFO Filing' || selectedService === 'ESIC Filing' || selectedService === 'PT-Tax Filing') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{selectedService} Documents</h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-blue-800">Wages Report / Calculation of monthly wages</Label>
                          <p className="text-xs text-blue-600 mt-1">
                            Upload wages report in Excel/Zip/Pdf/Word format
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {wagesReportFile && (
                            <span className="text-sm text-green-600 font-medium">
                              {wagesReportFile.name}
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('wages-report-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {wagesReportFile ? 'Change' : 'Upload'}
                          </Button>
                          <input
                            id="wages-report-upload"
                            type="file"
                            accept=".xlsx,.xls,.zip,.pdf,.doc,.docx"
                            onChange={(e) => setWagesReportFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          {wagesReportFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setWagesReportFile(null)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-blue-800">Salary Sheet of all Employed</Label>
                          <p className="text-xs text-blue-600 mt-1">
                            Upload salary sheet in Excel/Zip/Pdf/Word format
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {salarySheetFile && (
                            <span className="text-sm text-green-600 font-medium">
                              {salarySheetFile.name}
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('salary-sheet-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {salarySheetFile ? 'Change' : 'Upload'}
                          </Button>
                          <input
                            id="salary-sheet-upload"
                            type="file"
                            accept=".xlsx,.xls,.zip,.pdf,.doc,.docx"
                            onChange={(e) => setSalarySheetFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          {salarySheetFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSalarySheetFile(null)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Aadhaar PDF Upload */}
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-blue-800">Aadhaar Card (PDF)</Label>
                    <p className="text-xs text-blue-600 mt-1">
                      Upload your Aadhaar card in PDF format (Max 5MB)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {aadhaarFile && (
                      <span className="text-sm text-green-600 font-medium">
                        {aadhaarFile.name}
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('aadhaar-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {aadhaarFile ? 'Change' : 'Upload'}
                    </Button>
                    <input
                      id="aadhaar-upload"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    {aadhaarFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAadhaarFile(null)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

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

              {/* Custom titled documents */}
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
                  'Submit Tax Form'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}