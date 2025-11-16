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
interface CompanyForm {
  _id: string
  fullName: string
  email: string
  phone: string
  pan: string
  service?: string
  subService?: string
  companyName?: string
  businessActivity?: string
  proposedCapital?: string
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

const StatusBadge = ({ status }: { status: CompanyForm['status'] }) => {
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

export default function CompanyFormationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [forms, setForms] = useState<CompanyForm[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [subService, setSubService] = useState(searchParams.get('subService') || '');

  const fetchCompanyForms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      if (status) params.append('status', status);
      if (searchTerm) params.append('search', searchTerm);
      // Send service filter to backend (Company Information)
      params.append('service', 'Company Information');

      // Use the service-forms endpoint to get all forms
      const response = await api.get(`${API_PATHS.ADMIN.SERVICE_FORMS}?${params.toString()}`);
      
      // Filter to only show CompanyForm type forms
      let companyForms = response.data.forms.filter((form: any) => form.formType === 'CompanyForm');
      
      // Filter by subService if selected
      if (subService && subService !== 'all') {
        companyForms = companyForms.filter((form: any) => form.subService === subService);
      }
      
      setForms(companyForms);
      setPagination({
        total: companyForms.length,
        page: page,
        limit: 10,
        pages: Math.ceil(companyForms.length / 10)
      });
    } catch (error) {
      console.error('Failed to fetch company forms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Company Information forms.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, status, searchTerm, subService, toast]);

  useEffect(() => {
    fetchCompanyForms();
  }, [fetchCompanyForms]);

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
            <h1 className="text-3xl font-bold text-white">Company Information Forms</h1>
            <p className="text-muted-foreground text-white">Manage and review all Company Information applications.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or company..."
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
                    <SelectValue placeholder="Filter by company type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Company Types</SelectItem>
                    <SelectItem value="Private Limited Company">Private Limited Company</SelectItem>
                    <SelectItem value="One Person Company (OPC)">One Person Company (OPC)</SelectItem>
                    <SelectItem value="Public Limited Company">Public Limited Company</SelectItem>
                    <SelectItem value="Section 8 Company">Section 8 Company</SelectItem>
                    <SelectItem value="Nidhi Company">Nidhi Company</SelectItem>
                    <SelectItem value="Producer Company">Producer Company</SelectItem>
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
                    <TableHead>Company</TableHead>
                    <TableHead>Service</TableHead>
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
                      <TableCell>{form.companyName || '-'}</TableCell>
                      <TableCell>{form.subService || form.service || '-'}</TableCell>
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
                          onClick={() => router.push(`/admin/forms/company-information/${form._id}`)}
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
