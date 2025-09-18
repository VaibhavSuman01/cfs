"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { getAvatarUrl } from "@/lib/avatar-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Mail,
  CreditCard,
  Phone,
  FileText,
  CheckCircle,
  Circle,
  Download,
  ArrowRight,
  ExternalLink,
  Calendar,
  Fingerprint,
  User,
  Home,
  ChevronRight,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api-client";
import { EnhancedFooter } from "@/components/enhanced-footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// --- [NEW] Flipkart-Style Order Status Tracker Component ---
const OrderStatusTracker = ({
  status,
}: {
  status: "Pending" | "Reviewed" | "Filed";
}) => {
  const steps = ["Pending", "Reviewed", "Filed"];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  index <= currentStepIndex
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                {index <= currentStepIndex ? (
                  <CheckCircle size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  index <= currentStepIndex ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 border-t-2 mx-2 ${
                  index < currentStepIndex
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface FormSubmission {
  _id: string;
  formType: string;
  service?: string;
  subService?: string;
  status: "Pending" | "Reviewed" | "Filed";
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  companyName?: string;
  businessName?: string;
  year?: string;
  editHistory?: any[];
  reports?: Array<{
    documentId?: string;
    type?: string;
    message?: string;
    sentAt?: string;
  }>;
  // Add other common fields
}

// --- [Main] Revamped User Dashboard Component ---
export default function UserDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(true);

  // Check if user is blocked
  useEffect(() => {
    if (user && user.isBlocked) {
      router.push('/blocked');
    }
  }, [user, router]);

  const avatarSrc = getAvatarUrl(user?.avatarUrl);

  useEffect(() => {
    const fetchForms = async () => {
      setIsLoadingForms(true);
      try {
        const response = await api.get("/api/forms/user-submissions");
        setForms(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch user forms:", error);
      } finally {
        setIsLoadingForms(false);
      }
    };

    if (user) {
      fetchForms();
    }
  }, [user]);

  const handleDownloadLatestReport = async (form: FormSubmission) => {
    try {
      const latest = (form.reports || []).slice().reverse().find(r => r.documentId);
      if (!latest || !latest.documentId) return;
      const defaultName = latest.type ? `report-${latest.type}.pdf` : `report-${latest.documentId}`;
      await api.downloadFile(`/api/forms/download/${latest.documentId}`, defaultName);
    } catch (e) {
      console.error('Failed to download report', e);
    }
  };

  const handleDownloadAllReports = async (form: FormSubmission) => {
    try {
      const reportsWithDocs = (form.reports || []).filter(r => r.documentId);
      if (reportsWithDocs.length === 0) return;
      
      // Call the backend endpoint to download all reports as ZIP
      const response = await api.post(`/api/forms/download-all-reports/${form._id}`, {
        formType: form.formType
      }, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${form.formType}_${form._id}_admin_reports.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download all reports', e);
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
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getUserInitials = (name: string = "") => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${
        nameParts[nameParts.length - 1][0]
      }`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getFormTypeLabel = (formType: string) => {
    const typeMap: Record<string, string> = {
      'TaxForm': 'Tax Filing',
      'CompanyForm': 'Company Formation',
      'OtherRegistrationForm': 'Other Registration',
      'ROCForm': 'ROC Returns',
      'ReportsForm': 'Reports',
      'TrademarkISOForm': 'Trademark & ISO',
      'AdvisoryForm': 'Advisory'
    };
    return typeMap[formType] || formType;
  };

  const getFormDetailUrl = (formType: string, formId: string) => {
    const typeMap: Record<string, string> = {
      'TaxForm': `/dashboard/forms/${formId}`,
      'CompanyForm': `/dashboard/company-formation/${formId}`,
      'OtherRegistrationForm': `/dashboard/other-registration/${formId}`,
      'ROCForm': `/dashboard/roc-returns/${formId}`,
      'ReportsForm': `/dashboard/reports/${formId}`,
      'TrademarkISOForm': `/dashboard/trademark-iso/${formId}`,
      'AdvisoryForm': `/dashboard/advisory/${formId}`
    };
    return typeMap[formType] || `/dashboard/forms/${formId}`;
  };

  const getFormEditUrl = (formType: string, formId: string) => {
    const typeMap: Record<string, string> = {
      'TaxForm': `/dashboard/forms/edit/${formId}`,
      'CompanyForm': `/dashboard/company-formation/${formId}/edit`,
      'OtherRegistrationForm': `/dashboard/other-registration/${formId}/edit`,
      'ROCForm': `/dashboard/roc-returns/${formId}/edit`,
      'ReportsForm': `/dashboard/reports/${formId}/edit`,
      'TrademarkISOForm': `/dashboard/trademark-iso/${formId}/edit`,
      'AdvisoryForm': `/dashboard/advisory/${formId}/edit`
    };
    return typeMap[formType] || `/dashboard/forms/edit/${formId}`;
  };

  const getServiceLabel = (service: string) => {
    if (!service) return 'Service';
    
    // Map service names to more readable labels
    const serviceMap: Record<string, string> = {
      'GST Filing': 'GST Filing',
      'Income Tax Filing': 'Income Tax Filing',
      'TDS Returns': 'TDS Returns',
      'Tax Planning': 'Tax Planning',
      'EPFO Filing': 'EPFO Filing',
      'ESIC Filing': 'ESIC Filing',
      'PT-Tax Filing': 'PT-Tax Filing',
      'Corporate Tax Filing': 'Corporate Tax Filing',
      'Private Limited Company': 'Private Limited Company',
      'One Person Company': 'One Person Company',
      'Public Limited Company': 'Public Limited Company',
      'Section 8 Company': 'Section 8 Company',
      'Nidhi Company': 'Nidhi Company',
      'LLP Registration': 'LLP Registration',
      'Partnership Firm': 'Partnership Firm',
      'Sole Proprietorship': 'Sole Proprietorship',
      'GST Registration': 'GST Registration',
      'MSME Registration': 'MSME Registration',
      'FSSAI Food License': 'FSSAI Food License',
      'Digital Signature': 'Digital Signature',
      'EPFO Registration': 'EPFO Registration',
      'ESIC Registration': 'ESIC Registration',
      'IEC Registration': 'IEC Registration',
      'NGO Registration': 'NGO Registration',
      'Startup India Registration': 'Startup India Registration',
      'Producer Company': 'Producer Company',
      'Professional Tax': 'Professional Tax',
      'Trade License': 'Trade License',
      'PSARA License': 'PSARA License',
      'Industry License': 'Industry License',
      'Annual Filing': 'Annual Filing',
      'Board Resolutions': 'Board Resolutions',
      'Director Changes': 'Director Changes',
      'Share Transfer': 'Share Transfer',
      'Bank Reconciliation': 'Bank Reconciliation',
      'CMA Reports': 'CMA Reports',
      'DSCR Reports': 'DSCR Reports',
      'Project Reports': 'Project Reports',
      'Trademark Registration': 'Trademark Registration',
      'ISO 9001': 'ISO 9001',
      'ISO 14001': 'ISO 14001',
      'Copyright Registration': 'Copyright Registration',
      'Business Strategy Consulting': 'Business Strategy Consulting',
      'Financial Planning & Analysis': 'Financial Planning & Analysis',
      'Digital Transformation': 'Digital Transformation',
      'HR & Organizational Development': 'HR & Organizational Development',
      'Legal Compliance Advisory': 'Legal Compliance Advisory',
      'Startup Mentoring': 'Startup Mentoring',
      'Tax Planning & Analysis': 'Tax Planning & Analysis',
      'Assistance for Fund Raising': 'Assistance for Fund Raising',
      'Other Finance Related Services': 'Other Finance Related Services'
    };
    
    return serviceMap[service] || service;
  };

  const services = [
    {
      name: "Company Formation",
      items: [
        "Private Limited Company",
        "One Person Company (OPC)",
        "Public Limited Company",
        "Section 8 Company",
        "Nidhi Company",
        "Producer Company",
      ],
    },
    {name:"Taxation",items:[
      "GST Filing",
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
        "GST Filing",
      ],
    },
    {
      name: "Reports",
      items: [
        "Project Reports",
        "CMA Reports",
        "DSCR Reports",
        "Bank Reconciliation",
      ],
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
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-3xl">
                    {getUserInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold text-gray-900">
                  {user?.name}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>

                <div className="w-full border-t my-6"></div>

                <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 text-left">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      PAN
                    </p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                      {user?.pan || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      {user?.mobile || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Aadhaar
                    </p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <Fingerprint className="mr-2 h-4 w-4 text-gray-400" />
                      {user?.aadhaar || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Date of Birth
                    </p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      {user?.dob ? formatDate(user.dob) : "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Father's Name
                    </p>
                    <p className="text-sm font-medium text-gray-800 flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {user?.fatherName || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Address
                    </p>
                    <p className="text-sm font-medium text-gray-800 flex items-start">
                      <Home className="mr-2 h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                      <span>{user?.address || "Not provided"}</span>
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
                    <CardDescription>
                      Explore our wide range of financial and legal services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {services.map((category, index) => (
                        <AccordionItem
                          value={`item-${index + 1}`}
                          key={category.name}
                        >
                          <AccordionTrigger className="font-semibold text-base">
                            {category.name}
                          </AccordionTrigger>
                          <AccordionContent className="pl-2">
                            <ul className="space-y-3">
                              {category.items.map((service) => (
                                <li
                                  key={service}
                                  className="flex justify-between items-center p-2 rounded-md transition-colors hover:bg-gray-50"
                                >
                                  <span className="text-gray-700">
                                    {service}
                                  </span>
                                  {category.name === 'Taxation' ? (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link
                                        href={`/dashboard/new-form=${encodeURIComponent(service)}`}
                                      >
                                        File Now{" "}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  ) : category.name === 'Company Formation' ? (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link
                                        href={`/dashboard/company-formation?service=${encodeURIComponent(service)}`}
                                      >
                                        Apply Now{" "}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  ) : category.name === 'Other Registration' ? (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link
                                        href={`/dashboard/other-registration?service=${encodeURIComponent(service)}`}
                                      >
                                        Apply Now{" "}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  ) : category.name === 'Reports' ? (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link
                                        href={`/dashboard/reports?service=${encodeURIComponent(service)}`}
                                      >
                                        Apply Now{" "}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  ) : category.name === 'Trademark & ISO' ? (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link
                                        href={`/dashboard/trademark-iso?service=${encodeURIComponent(service)}`}
                                      >
                                        Apply Now{" "}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  ) : category.name === 'ROC Returns' ? (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link
                                        href={`/dashboard/roc-returns?service=${encodeURIComponent(service)}`}
                                      >
                                        Apply Now{" "}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  ) : category.name === 'Advisory' ? (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link
                                        href={`/dashboard/advisory?service=${encodeURIComponent(service)}`}
                                      >
                                        Apply Now{" "}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  ) : (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link
                                        href={`/contact?service=${encodeURIComponent(
                                          service
                                        )}`}
                                      >
                                        Enquire Now{" "}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                      </Link>
                                    </Button>
                                  )}
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
                    <CardTitle>Your Form Submissions</CardTitle>
                    <CardDescription>
                      Track the filing status of all your forms across all services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingForms ? (
                      <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      </div>
                    ) : forms.length > 0 ? (
                      <div className="space-y-6">
                        {forms.map((form) => (
                          <div
                            key={form._id}
                            className="rounded-lg border bg-white p-4 transition-all hover:shadow-md"
                          >
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-800 flex items-center gap-2">
                                      {getFormTypeLabel(form.formType)} - {getServiceLabel(form.service || 'Service')}{form.year ? ` - FY ${form.year}` : ''}
                                      {form.reports && form.reports.length > 0 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          {form.reports.length} Report{form.reports.length > 1 ? 's' : ''}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Submitted: {formatDate(form.createdAt)}{' '}
                                      {new Date(form.updatedAt).getTime() > new Date(form.createdAt).getTime() && (
                                        <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Last updated: {formatDate(form.updatedAt)}</span>
                                      )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {form.status === 'Pending' && form.editHistory && form.editHistory.length < 2 && (
                                      <Button variant="secondary" size="sm" asChild>
                                        <Link href={getFormEditUrl(form.formType, form._id)}>
                                          <Pencil className="mr-2 h-4 w-4"/> Edit
                                        </Link>
                                      </Button>
                                    )}
                                    {form.reports && form.reports.length > 0 && (
                                        <div className="flex gap-2">
                                          {form.reports.some((r: any) => r.documentId) && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                              onClick={() => handleDownloadLatestReport(form)}
                                            >
                                                <Download className="mr-2 h-4 w-4"/> Download Latest
                                            </Button>
                                          )}
                                          {form.reports.length > 1 && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                                              onClick={() => handleDownloadAllReports(form)}
                                            >
                                                <Download className="mr-2 h-4 w-4"/> Download All
                                            </Button>
                                          )}
                                        </div>
                                    )}
                                    <Button size="sm" asChild>
                                        <Link href={getFormDetailUrl(form.formType, form._id)}>View Details</Link>
                                    </Button>
                                </div>
                            </div>
                            <OrderStatusTracker
                              status={
                                form.status as "Pending" | "Reviewed" | "Filed"
                              }
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-16 w-16 text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium">
                          No Forms Submitted
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Click below to start filing your first form.
                        </p>
                        <Button className="mt-6" asChild>
                          <Link href="/dashboard/new-form">File New Form</Link>
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
      <EnhancedFooter />
    </div>
  );
}
