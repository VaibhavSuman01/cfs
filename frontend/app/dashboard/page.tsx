'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Mail, CreditCard, Phone, FileText, CheckCircle, Circle, Download, ArrowRight, ExternalLink, Calendar, Fingerprint, User, Home, ChevronRight, Pencil } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api-client';

// --- [NEW] Flipkart-Style Order Status Tracker Component ---
const OrderStatusTracker = ({ status }: { status: 'Pending' | 'Reviewed' | 'Filed' }) => {
  const steps = ['Pending', 'Reviewed', 'Filed'];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  index <= currentStepIndex ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-500'
                }`}
              >
                {index <= currentStepIndex ? <CheckCircle size={20} /> : <Circle size={20} />}
              </div>
              <p className={`mt-2 text-xs font-medium ${index <= currentStepIndex ? 'text-blue-600' : 'text-gray-500'}`}>
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 border-t-2 mx-2 ${index < currentStepIndex ? 'border-blue-600' : 'border-gray-300'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface TaxForm {
  _id: string;
  service?: string;
  year?: string;
  status: 'Pending' | 'Reviewed' | 'Filed';
  createdAt: string;
  updatedAt: string;
  editHistory: any[];
  reports?: Array<{
    documentId?: string;
    type?: string;
    message?: string;
    sentAt?: string;
  }>;
}

// --- [Main] Revamped User Dashboard Component ---
export default function UserDashboard() {
  const { user, isLoading } = useAuth();
  const [forms, setForms] = useState<TaxForm[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      setIsLoadingForms(true);
      try {
        const response = await api.get('/api/forms/user-submissions');
        setForms(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch user forms:', error);
      } finally {
        setIsLoadingForms(false);
      }
    };

    if (user) {
      fetchForms();
    }
  }, [user]);

  const handleDownloadLatestReport = async (form: TaxForm) => {
    try {
      const latest = (form.reports || []).slice().reverse().find(r => r.documentId);
      if (!latest || !latest.documentId) return;
      const defaultName = latest.type ? `report-${latest.type}.pdf` : `report-${latest.documentId}`;
      await api.downloadFile(`/api/forms/download/${latest.documentId}`, defaultName);
    } catch (e) {
      console.error('Failed to download report', e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  const getUserInitials = (name: string = '') => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  const services = [
    {
      name: "Company Formation",
      items: [
        "Private Limited Company",
        "One Person Company (OPC)",
        "Public Limited Company",
        "Section 8 Company",
        "Nidhi Company",
      ],
    },
    {name:"Taxation",items:[
      "GST Registration",
      "Income Tax Filing",
      "TDS Returns",
      "Tax Planning",
      "EPFO Filing",
      "ESIC Filing",
      "PT-Tax Filing",
      "Corporate Tax Filing",
    ]},
    {
      name: "Other Registration",
      items: [
        "LLP Registration",
        "Partnership Firm",
        "Proprietorship",
        "Producer Company",
        "MSME/Udyam Registration",
        "EPFO",
        "ESIC",
        "PT Tax",
        "IEC Registration",
        "Gumusta / Form-3 / Shop Registration",
        "Fassai (Food) Licence / Register",
        "Industry Licence / register",
        "NGO Registration",
        "PAN Apply",
        "TAN Apply",
        "Start-up India Registration",
        "Digital Registration",
        "GST Registration",
      ],
    },
    {
      name: "Reports",
      items: ["Project Reports", "CMA Reports", "DSCR Reports", "Bank Reconciliation"],
    },
    {
      name: "Trademark & ISO",
      items: [
        "Trademark Registration",
        "ISO 9001 Certification",
        "ISO 14001 Certification",
        "Copyright Registration",
      ],
    },
    {
      name: "ROC Returns",
      items: [
        "Annual Filing",
        "Board Resolutions",
        "Director Changes",
        "Share Transfer",
      ],
    },
    {
      name: "Advisory",
      items: [
        "Business Strategy Consulting",
        "Legal & Compliance Advisory",
        "HR & Organizational Development",
        "Financial Planning & Analysis",
        "Digital Transformation",
        "Startup Mentoring",
        "Tax Plan Analysis",
        "Assistance for Fund Reganing",
        "Other Finance Related Services",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50/50">
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* --- Left Column: User Profile --- */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.avatarUrl ? `http://localhost:5001${user.avatarUrl}` : '/avatar-placeholder.png'} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-3xl">{getUserInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                
                <div className="w-full border-t my-6"></div>

                <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 text-left">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">PAN</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-gray-400"/>
                      {user?.pan || 'Not provided'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-400"/>
                      {user?.mobile || 'Not provided'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Aadhaar</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <Fingerprint className="mr-2 h-4 w-4 text-gray-400"/>
                      {user?.aadhaar || 'Not provided'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400"/>
                      {user?.dob ? formatDate(user.dob) : 'Not provided'}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Father's Name</p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-400"/>
                      {user?.fatherName || 'Not provided'}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Address</p>
                    <p className="text-sm font-medium text-gray-800 flex items-start">
                      <Home className="mr-2 h-4 w-4 text-gray-400 mt-1 flex-shrink-0"/>
                      <span>{user?.address || 'Not provided'}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/profile">Update Profile</Link>
                 </Button>
              </CardFooter>
            </Card>
          </div>

          {/* --- Right Column: Services & Forms --- */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="services">
              <TabsList className="grid w-full grid-cols-2 bg-blue-100/70 p-1">
                <TabsTrigger value="services">Our Services</TabsTrigger>
                <TabsTrigger value="forms">My Forms</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="mt-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Our Services</CardTitle>
                    <CardDescription>Explore our wide range of financial and legal services.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {services.map((category, index) => (
                        <AccordionItem value={`item-${index + 1}`} key={category.name}>
                          <AccordionTrigger className="font-semibold text-base">{category.name}</AccordionTrigger>
                          <AccordionContent className="pl-2">
                            <ul className="space-y-3">
                              {category.items.map((service) => (
                                <li key={service} className="flex justify-between items-center p-2 rounded-md transition-colors hover:bg-gray-50">
                                  <span className="text-gray-700">{service}</span>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/contact?service=${encodeURIComponent(service)}`}>
                                      Enquire Now <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forms" className="mt-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Your Tax Form Submissions</CardTitle>
                    <CardDescription>Track the filing status of all your forms.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingForms ? (
                      <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
                    ) : forms.length > 0 ? (
                      <div className="space-y-6">
                        {forms.map((form) => (
                          <div key={form._id} className="rounded-lg border bg-white p-4 transition-all hover:shadow-md">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-800">{form.service || 'Form'}{form.year ? ` - FY ${form.year}` : ''}</div>
                                    <div className="text-xs text-gray-500">
                                      Submitted: {formatDate(form.createdAt)}{' '}
                                      {new Date(form.updatedAt).getTime() > new Date(form.createdAt).getTime() && (
                                        <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">Last updated: {formatDate(form.updatedAt)}</span>
                                      )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {form.status === 'Pending' && form.editHistory && form.editHistory.length < 2 && (
                                      <Button variant="secondary" size="sm" asChild>
                                        <Link href={`/dashboard/forms/edit/${form._id}`}>
                                          <Pencil className="mr-2 h-4 w-4"/> Edit
                                        </Link>
                                      </Button>
                                    )}
                                    {form.status === 'Filed' && (form.reports?.some(r => r.documentId)) && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                                          onClick={() => handleDownloadLatestReport(form)}
                                        >
                                            <Download className="mr-2 h-4 w-4"/> Download Report
                                        </Button>
                                    )}
                                    <Button size="sm" asChild>
                                        <Link href={`/dashboard/forms/${form._id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </div>
                            <OrderStatusTracker status={form.status as 'Pending' | 'Reviewed' | 'Filed'} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-16 w-16 text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium">No Forms Submitted</h3>
                        <p className="mt-2 text-sm text-gray-500">Click below to start filing your first tax return.</p>
                        <Button className="mt-6" asChild>
                          <Link href="/dashboard/new-form">File New ITR</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}