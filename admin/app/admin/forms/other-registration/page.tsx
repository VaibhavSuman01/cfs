'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileText, Search, Filter, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, Building2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api-client'
import { API_PATHS } from '@/lib/api-client'

// Types
interface OtherRegistrationForm {
  _id: string
  fullName: string
  email: string
  phone: string
  pan: string
  subService?: string
  businessName?: string
  businessType?: string
  businessAddress?: string
  city?: string
  state?: string
  pincode?: string
  status: 'Pending' | 'Reviewed' | 'Filed'
  documents: any[]
  createdAt: string
  updatedAt: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

const StatusBadge = ({ status }: { status: OtherRegistrationForm['status'] }) => {
  const statusConfig = {
    Pending: {
      variant: 'secondary',
      icon: <Clock className="mr-1 h-3 w-3" />,
      label: 'Pending',
    },
    Reviewed: {
      variant: 'default',
      icon: <AlertCircle className="mr-1 h-3 w-3" />,
      label: 'Reviewed',
    },
    Filed: {
      variant: 'default',
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
      label: 'Filed',
    },
  };

  const config = statusConfig[status] || { variant: 'outline', icon: null, label: 'Unknown' };

  return (
    <Badge variant={config.variant as any}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default function OtherRegistrationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [forms, setForms] = useState<OtherRegistrationForm[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [subService, setSubService] = useState(searchParams.get('subService') || '');

  const fetchOtherRegistrationForms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      if (status) params.append('status', status);
      if (searchTerm) params.append('search', searchTerm);
      // Send service filter to backend (Other Registration)
      params.append('service', 'Other Registration');

      // Use the service-forms endpoint to get all forms
      const response = await api.get(`${API_PATHS.ADMIN.SERVICE_FORMS}?${params.toString()}`);
      
      // Filter to show OtherRegistrationForm and PartnershipForm (Partnership Firm sub-service)
      // PartnershipForm has service: "Other Registration" and subService: "partnership-firm"
      let otherRegistrationForms = response.data.forms.filter((form: any) => {
        // Show OtherRegistrationForm forms
        if (form.formType === 'OtherRegistrationForm') {
          return true;
        }
        // Show PartnershipForm forms that belong to Other Registration service
        if (form.formType === 'PartnershipForm') {
          return form.service === 'Other Registration' || form.subService === 'partnership-firm' || form.subService === 'Partnership Firm';
        }
        return false;
      });
      
      // Filter by subService if selected
      if (subService && subService !== 'all') {
        otherRegistrationForms = otherRegistrationForms.filter((form: any) => {
          // Normalize subService values for comparison
          const formSubService = form.subService?.toLowerCase() || '';
          const filterSubService = subService.toLowerCase();
          
          // Handle partnership-firm variations
          if (filterSubService === 'partnership firm' || filterSubService === 'partnership-firm') {
            return formSubService === 'partnership firm' || formSubService === 'partnership-firm';
          }
          
          return formSubService === filterSubService || form.subService === subService;
        });
      }
      
      setForms(otherRegistrationForms);
      setPagination({
        total: otherRegistrationForms.length,
        page: page,
        limit: 10,
        pages: Math.ceil(otherRegistrationForms.length / 10)
      });
    } catch (error) {
      console.error('Failed to fetch other registration forms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load other registration forms.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, status, searchTerm, subService, toast]);

  useEffect(() => {
    fetchOtherRegistrationForms();
  }, [fetchOtherRegistrationForms]);

  // Sync state from URL when query params change
  useEffect(() => {
    const urlStatus = searchParams.get('status') || '';
    const urlSubService = searchParams.get('subService') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlPage = Number(searchParams.get('page')) || 1;

    if (urlStatus !== status) setStatus(urlStatus);
    if (urlSubService !== subService) setSubService(urlSubService);
    if (urlSearch !== searchTerm) setSearchTerm(urlSearch);
    if (urlPage !== page) setPage(urlPage);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (searchTerm) params.set('search', searchTerm);
    if (subService) params.set('subService', subService);
    params.set('page', String(page));

    const next = `${pathname}?${params.toString()}`;
    const current = `${pathname}?${searchParams.toString()}`;
    if (next !== current) {
      router.push(next);
    }
  }, [status, searchTerm, subService, page, pathname, router, searchParams]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus === 'all' ? '' : newStatus);
    setPage(1);
  };

  const handleSubServiceChange = (newSubService: string) => {
    setSubService(newSubService === 'all' ? '' : newSubService);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.pages || 1)) {
      setPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Other Registration Forms</h1>
            <p className="text-muted-foreground text-white">Manage and review all other registration applications.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or business..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="w-full md:w-1/4">
                <Select onValueChange={handleStatusChange} value={status || 'all'}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                    <SelectItem value="Filed">Filed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/4">
                <Select onValueChange={handleSubServiceChange} value={subService || 'all'}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by registration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Registration Types</SelectItem>
                    <SelectItem value="llp-registration">LLP Registration</SelectItem>
                    <SelectItem value="partnership-firm">Partnership Firm</SelectItem>
                    <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="gst-registration">GST Registration</SelectItem>
                    <SelectItem value="msme-registration">MSME Registration</SelectItem>
                    <SelectItem value="fssai-food-license">FSSAI Food License</SelectItem>
                    <SelectItem value="digital-signature">Digital Signature</SelectItem>
                    <SelectItem value="epfo-registration">EPFO Registration</SelectItem>
                    <SelectItem value="ESIC Registration">ESIC Registration</SelectItem>
                    <SelectItem value="IEC Registration">IEC Registration</SelectItem>
                    <SelectItem value="NGO Registration">NGO Registration</SelectItem>
                    <SelectItem value="Startup India Registration">Startup India Registration</SelectItem>
                    <SelectItem value="Producer Company">Producer Company</SelectItem>
                    <SelectItem value="Professional Tax">Professional Tax</SelectItem>
                    <SelectItem value="Trade License">Trade License</SelectItem>
                    <SelectItem value="PSARA License">PSARA License</SelectItem>
                    <SelectItem value="Industry License">Industry License</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form._id}>
                      <TableCell className="font-medium">{form.fullName}</TableCell>
                      <TableCell>{form.businessName || '-'}</TableCell>
                      <TableCell>{form.subService || '-'}</TableCell>
                      <TableCell>{form.city && form.state ? `${form.city}, ${form.state}` : '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={form.status} />
                      </TableCell>
                      <TableCell>{form.documents?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{formatDate(form.createdAt)}</span>
                          {new Date(form.updatedAt).getTime() > new Date(form.createdAt).getTime() && (
                            <Badge variant="outline" className="text-xs">Edited</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/forms/other-registration/${form._id}`)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {pagination && pagination.total > 0 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} forms
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= pagination.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
