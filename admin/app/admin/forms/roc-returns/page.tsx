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
interface ROCForm {
  _id: string
  fullName: string
  email: string
  phone: string
  pan: string
  service?: string
  companyName?: string
  companyType?: string
  companyAddress?: string
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

const StatusBadge = ({ status }: { status: ROCForm['status'] }) => {
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

export default function ROCReturnsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [forms, setForms] = useState<ROCForm[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [service, setService] = useState(searchParams.get('service') || '');

  const fetchROCForms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      if (status) params.append('status', status);
      if (searchTerm) params.append('search', searchTerm);
      if (service) params.append('service', service);

      // Use the service-forms endpoint to get all forms
      const response = await api.get(`${API_PATHS.ADMIN.SERVICE_FORMS}?${params.toString()}`);
      
      // Filter to only show ROCForm type forms
      const rocForms = response.data.forms.filter((form: any) => form.formType === 'ROCForm');
      
      setForms(rocForms);
      setPagination({
        total: rocForms.length,
        page: page,
        limit: 10,
        pages: Math.ceil(rocForms.length / 10)
      });
    } catch (error) {
      console.error('Failed to fetch ROC forms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load ROC forms.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, status, searchTerm, service, toast]);

  useEffect(() => {
    fetchROCForms();
  }, [fetchROCForms]);

  // Sync state from URL when query params change
  useEffect(() => {
    const urlStatus = searchParams.get('status') || '';
    const urlService = searchParams.get('service') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlPage = Number(searchParams.get('page')) || 1;

    if (urlStatus !== status) setStatus(urlStatus);
    if (urlService !== service) setService(urlService);
    if (urlSearch !== searchTerm) setSearchTerm(urlSearch);
    if (urlPage !== page) setPage(urlPage);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (searchTerm) params.set('search', searchTerm);
    if (service) params.set('service', service);
    params.set('page', String(page));

    const next = `${pathname}?${params.toString()}`;
    const current = `${pathname}?${searchParams.toString()}`;
    if (next !== current) {
      router.push(next);
    }
  }, [status, searchTerm, service, page, pathname, router, searchParams]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus === 'all' ? '' : newStatus);
    setPage(1);
  };

  const handleServiceChange = (newService: string) => {
    setService(newService === 'all' ? '' : newService);
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
            <h1 className="text-3xl font-bold text-white">ROC Returns Forms</h1>
            <p className="text-muted-foreground text-white">Manage and review all ROC returns applications.</p>
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
                <Select onValueChange={handleServiceChange} value={service || 'all'}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="Annual Returns">Annual Returns</SelectItem>
                    <SelectItem value="Event Based Returns">Event Based Returns</SelectItem>
                    <SelectItem value="Compliance Returns">Compliance Returns</SelectItem>
                    <SelectItem value="Form MGT-7">Form MGT-7</SelectItem>
                    <SelectItem value="Form AOC-4">Form AOC-4</SelectItem>
                    <SelectItem value="Form DIR-3 KYC">Form DIR-3 KYC</SelectItem>
                    <SelectItem value="Form CHG-1">Form CHG-1</SelectItem>
                    <SelectItem value="Form PAS-3">Form PAS-3</SelectItem>
                    <SelectItem value="Form SH-7">Form SH-7</SelectItem>
                    <SelectItem value="Form SH-8">Form SH-8</SelectItem>
                    <SelectItem value="Form SH-11">Form SH-11</SelectItem>
                    <SelectItem value="Form SH-12">Form SH-12</SelectItem>
                    <SelectItem value="Form INC-22">Form INC-22</SelectItem>
                    <SelectItem value="Form INC-23">Form INC-23</SelectItem>
                    <SelectItem value="Form INC-27">Form INC-27</SelectItem>
                    <SelectItem value="Form INC-28">Form INC-28</SelectItem>
                    <SelectItem value="Form INC-29">Form INC-29</SelectItem>
                    <SelectItem value="Form INC-30">Form INC-30</SelectItem>
                    <SelectItem value="Form INC-31">Form INC-31</SelectItem>
                    <SelectItem value="Form INC-32">Form INC-32</SelectItem>
                    <SelectItem value="Form INC-33">Form INC-33</SelectItem>
                    <SelectItem value="Form INC-34">Form INC-34</SelectItem>
                    <SelectItem value="Form INC-35">Form INC-35</SelectItem>
                    <SelectItem value="Form INC-36">Form INC-36</SelectItem>
                    <SelectItem value="Form INC-37">Form INC-37</SelectItem>
                    <SelectItem value="Form INC-38">Form INC-38</SelectItem>
                    <SelectItem value="Form INC-39">Form INC-39</SelectItem>
                    <SelectItem value="Form INC-40">Form INC-40</SelectItem>
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
                      <TableCell>{form.companyName || '-'}</TableCell>
                      <TableCell>{form.service || '-'}</TableCell>
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
                          onClick={() => router.push(`/admin/forms/roc-returns/${form._id}`)}
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
