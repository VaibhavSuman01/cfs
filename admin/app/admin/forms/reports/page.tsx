'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  FileText,
  BarChart3,
  Calculator,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import api, { API_PATHS } from '@/lib/api-client'

interface ReportsForm {
  _id: string
  service: string
  subService?: string
  companyName?: string
  fullName: string
  email: string
  phone: string
  status: 'Pending' | 'Reviewed' | 'Filed'
  createdAt: string
  documents: string[]
  reportPeriod?: string
  reportType?: string
  user?: {
    _id: string
    name: string
    email: string
    mobile: string
    pan: string
  }
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export default function ReportsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [forms, setForms] = useState<ReportsForm[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [subServiceFilter, setSubServiceFilter] = useState(searchParams.get('subService') || 'all')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  const fetchForms = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', String(page))
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)
      // Send service filter to backend (Reports)
      params.append('service', 'Reports')

      const response = await api.get(`${API_PATHS.ADMIN.SERVICE_FORMS}?${params.toString()}`)
      
      // Filter to only show ReportsForm type forms
      let reportsForms = response.data.forms.filter((form: any) => form.formType === 'ReportsForm')
      
      // Filter by subService if selected
      if (subServiceFilter && subServiceFilter !== 'all') {
        reportsForms = reportsForms.filter((form: any) => {
          const formSubService = form.subService?.toLowerCase() || ''
          const filterSubService = subServiceFilter.toLowerCase()
          return formSubService === filterSubService || form.subService === subServiceFilter
        })
      }
      
      setForms(reportsForms || [])
      setPagination({
        total: reportsForms.length,
        page: page,
        limit: 10,
        pages: Math.ceil(reportsForms.length / 10)
      })
    } catch (error) {
      console.error('Error fetching forms:', error)
      toast.error('Failed to load forms. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, searchTerm, subServiceFilter])

  useEffect(() => {
    fetchForms()
  }, [fetchForms])

  // Sync state from URL when query params change
  useEffect(() => {
    const urlStatus = searchParams.get('status') || 'all'
    const urlSubService = searchParams.get('subService') || 'all'
    const urlSearch = searchParams.get('search') || ''
    const urlPage = Number(searchParams.get('page')) || 1

    if (urlStatus !== statusFilter) setStatusFilter(urlStatus)
    if (urlSubService !== subServiceFilter) setSubServiceFilter(urlSubService)
    if (urlSearch !== searchTerm) setSearchTerm(urlSearch)
    if (urlPage !== page) setPage(urlPage)
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (searchTerm) params.set('search', searchTerm)
    if (subServiceFilter !== 'all') params.set('subService', subServiceFilter)
    params.set('page', String(page))

    const next = `${pathname}?${params.toString()}`
    const current = `${pathname}?${searchParams.toString()}`
    if (next !== current) {
      router.push(next)
    }
  }, [statusFilter, searchTerm, subServiceFilter, page, pathname, router, searchParams])

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus)
    setPage(1)
  }

  const handleSubServiceChange = (newSubService: string) => {
    setSubServiceFilter(newSubService)
    setPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.pages || 1)) {
      setPage(newPage)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'Reviewed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Reviewed</Badge>
      case 'Filed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><FileText className="w-3 h-3 mr-1" />Filed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Forms are already filtered in fetchForms, so we just need to paginate
  const startIndex = (page - 1) * 10
  const endIndex = startIndex + 10
  const paginatedForms = forms.slice(startIndex, endIndex)

  const exportData = () => {
    // TODO: Implement export functionality
    console.log('Exporting data...')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Forms</h1>
          <p className="text-gray-600">Manage financial and business reports applications</p>
        </div>
        <Button onClick={exportData} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{forms.filter(f => f.status === 'Pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-gray-900">{forms.filter(f => f.status === 'Reviewed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Filed</p>
                <p className="text-2xl font-bold text-gray-900">{forms.filter(f => f.status === 'Filed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by company, applicant, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <Select value={subServiceFilter} onValueChange={handleSubServiceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Report Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Report Types</SelectItem>
                  <SelectItem value="bank-reconciliation">Bank Reconciliation</SelectItem>
                  <SelectItem value="cma-reports">CMA Reports</SelectItem>
                  <SelectItem value="dscr-reports">DSCR Reports</SelectItem>
                  <SelectItem value="project-reports">Project Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Filed">Filed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedForms.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No forms found</h3>
              <p className="mt-1 text-sm text-gray-500">No reports forms match your current filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedForms.map((form) => (
                    <tr key={form._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{form.service}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{form.companyName || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{form.fullName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{form.email}</div>
                          <div className="text-sm text-gray-500">{form.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{form.reportPeriod || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{form.reportType || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(form.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="outline" size="sm" className="mr-2">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Update Status
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && pagination.total > 0 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, pagination.total)} of {pagination.total} forms
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
