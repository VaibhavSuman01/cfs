'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Download, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  MessageSquare,
  BarChart3
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import DocumentDisplay from '@/components/ui/document-display'
import AdminReportSection from '@/components/ui/admin-report-section'
import api from '@/lib/api-client'
import { API_PATHS } from '@/lib/api-client'

interface ReportsForm {
  _id: string
  fullName: string
  email: string
  phone: string
  pan: string
  service?: string
  companyName?: string
  reportType?: string
  reportPeriod?: string
  subject?: string
  description?: string
  priority?: string
  dueDate?: string
  status: 'Pending' | 'Reviewed' | 'Filed'
  documents: Array<{
    filename: string
    originalname: string
    mimetype: string
    size: number
    path: string
  }>
  reports: Array<{
    message: string
    documents: string[]
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

const StatusBadge = ({ status }: { status: ReportsForm['status'] }) => {
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

export default function ReportsDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [form, setForm] = useState<ReportsForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [sendingReport, setSendingReport] = useState(false)
  
  // Status update dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<ReportsForm['status']>('Pending')
  
  // Report dialog
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportMessage, setReportMessage] = useState('')
  const [reportDocuments, setReportDocuments] = useState<File[]>([])

  const formId = params.id as string

  useEffect(() => {
    fetchFormDetails()
  }, [formId])

  const fetchFormDetails = async () => {
    try {
      setLoading(true)
      // Fetch from service-forms endpoint and filter for this specific form
      const response = await api.get(`${API_PATHS.ADMIN.SERVICE_FORMS}`)
      const forms = response.data.forms
      const targetForm = forms.find((f: any) => f._id === formId && f.formType === 'ReportsForm')
      
      if (targetForm) {
        setForm(targetForm)
        setNewStatus(targetForm.status)
      } else {
        toast({
          title: 'Error',
          description: 'Form not found',
          variant: 'destructive',
        })
        router.push('/admin/forms/reports')
      }
    } catch (error) {
      console.error('Failed to fetch form details:', error)
      toast({
        title: 'Error',
        description: 'Failed to load form details',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!form) return
    
    try {
      setUpdatingStatus(true)
      // Update status using the appropriate endpoint
      await api.put(API_PATHS.ADMIN.FORM_STATUS(form._id), {
        status: newStatus,
        comment: 'Status updated by admin',
      })
      
      setForm(prev => prev ? { ...prev, status: newStatus } : null)
      setStatusDialogOpen(false)
      
      toast({
        title: 'Success',
        description: 'Form status updated successfully',
      })
    } catch (error) {
      console.error('Failed to update status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update form status',
        variant: 'destructive',
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleSendReport = async () => {
    if (!form || !reportMessage.trim()) return
    
    try {
      setSendingReport(true)
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('reportType', 'Reports');
      formData.append('message', reportMessage);
      if (reportDocuments.length > 0) {
        reportDocuments.forEach((file, index) => {
          formData.append('reportFile', file);
        });
      }

      // Call the backend API to send the report
      await api.post(`/api/admin/forms/${form._id}/send-report`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh the form data to get the updated reports
      const response = await api.get(`${API_PATHS.ADMIN.SERVICE_FORMS}`)
      const forms = response.data.forms
      const targetForm = forms.find((f: any) => f._id === form._id && f.formType === 'ReportsForm')
      
      if (targetForm) {
        setForm(targetForm)
      }
      
      setReportDialogOpen(false)
      setReportMessage('')
      setReportDocuments([])
      
      toast({
        title: 'Success',
        description: 'Report sent successfully to the user.',
      })
    } catch (error) {
      console.error('Failed to send report:', error)
      toast({
        title: 'Error',
        description: 'Failed to send report',
        variant: 'destructive',
      })
    } finally {
      setSendingReport(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Form not found</h1>
          <Button onClick={() => router.push('/admin/forms/reports')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/forms/reports')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Reports Form</h1>
              <p className="text-muted-foreground text-white">
                {form.companyName || form.fullName} - {form.service}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={form.status} />
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  Send Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send Report</DialogTitle>
                  <DialogDescription>
                    Send a report to the user. This will appear in their dashboard (email functionality temporarily disabled).
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Enter your report message..."
                      value={reportMessage}
                      onChange={(e) => setReportMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Attach Documents (Optional)</label>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => setReportDocuments(Array.from(e.target.files || []))}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendReport} disabled={sendingReport || !reportMessage.trim()}>
                      {sendingReport ? 'Sending...' : 'Send Report'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Form Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Reviewed">Reviewed</SelectItem>
                      <SelectItem value="Filed">Filed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleStatusUpdate} disabled={updatingStatus}>
                      {updatingStatus ? 'Updating...' : 'Update Status'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-sm">{form.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">PAN</label>
                  <p className="text-sm">{form.pan}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {form.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {form.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Report Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                  <p className="text-sm">{form.companyName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service</label>
                  <p className="text-sm">{form.service || 'Not specified'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Report Type</label>
                  <p className="text-sm">{form.reportType || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Report Period</label>
                  <p className="text-sm">{form.reportPeriod || 'Not specified'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <p className="text-sm">{form.subject || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm">{form.description || 'Not provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <p className="text-sm">{form.priority || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                  <p className="text-sm">{form.dueDate || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <DocumentDisplay
            documents={form.documents || []}
            formId={form._id}
            formType="ReportsForm"
            title="Uploaded Documents"
            showBulkDownload={true}
          />

          {/* Admin Reports */}
          <AdminReportSection
            reports={form.reports || []}
            formId={form._id}
            formType="ReportsForm"
            title="Admin Reports"
            className="mt-6"
          />
        </div>

        {/* Form Details */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Form Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Form ID</label>
                <p className="text-sm font-mono">{form._id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created On</label>
                <p className="text-sm">{formatDate(form.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{formatDate(form.updatedAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                <StatusBadge status={form.status} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
