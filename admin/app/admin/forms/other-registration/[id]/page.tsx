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
  MessageSquare
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api-client'
import { API_PATHS } from '@/lib/api-client'

interface OtherRegistrationForm {
  _id: string
  fullName: string
  email: string
  phone: string
  pan: string
  service?: string
  businessName?: string
  businessType?: string
  businessAddress?: string
  city?: string
  state?: string
  pincode?: string
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

export default function OtherRegistrationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [form, setForm] = useState<OtherRegistrationForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [sendingReport, setSendingReport] = useState(false)
  
  // Status update dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<OtherRegistrationForm['status']>('Pending')
  
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
      const targetForm = forms.find((f: any) => f._id === formId && f.formType === 'OtherRegistrationForm')
      
      if (targetForm) {
        setForm(targetForm)
        setNewStatus(targetForm.status)
      } else {
        toast({
          title: 'Error',
          description: 'Form not found',
          variant: 'destructive',
        })
        router.push('/admin/forms/other-registration')
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
      
      // For now, just update local state since backend endpoint is not implemented
      // TODO: Implement backend endpoint for sending reports
      const newReport = {
        message: reportMessage,
        documents: reportDocuments.map(doc => doc.name),
        createdAt: new Date().toISOString()
      };

      // Update local form state to show the new report
      setForm(prev => prev ? {
        ...prev,
        reports: [...(prev.reports || []), newReport]
      } : null);
      
      setReportDialogOpen(false)
      setReportMessage('')
      setReportDocuments([])
      
      toast({
        title: 'Success',
        description: 'Report added successfully. (Backend integration pending)',
      })
    } catch (error) {
      console.error('Failed to add report:', error)
      toast({
        title: 'Error',
        description: 'Failed to add report',
        variant: 'destructive',
      })
    } finally {
      setSendingReport(false)
    }
  }

  const handleDocumentDownload = async (document: any) => {
    try {
      const response = await api.get(`/api/documents/${document.filename}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', document.originalname)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download document:', error)
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive',
      })
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
          <Button onClick={() => router.push('/admin/forms/other-registration')} className="mt-4">
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
              onClick={() => router.push('/admin/forms/other-registration')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Other Registration Form</h1>
              <p className="text-muted-foreground text-white">
                {form.businessName || form.fullName} - {form.service}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={form.status} />
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

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                  <p className="text-sm">{form.businessName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Type</label>
                  <p className="text-sm">{form.businessType || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Service</label>
                <p className="text-sm">{form.service || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  {form.businessAddress || 'Not provided'}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">City</label>
                  <p className="text-sm">{form.city || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">State</label>
                  <p className="text-sm">{form.state || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pincode</label>
                  <p className="text-sm">{form.pincode || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded Documents ({form.documents?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {form.documents && form.documents.length > 0 ? (
                <div className="space-y-2">
                  {form.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.originalname}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDocumentDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No documents uploaded</p>
              )}
            </CardContent>
          </Card>

          {/* Reports */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reports ({form.reports?.length || 0})
                </CardTitle>
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
              </div>
            </CardHeader>
            <CardContent>
              {form.reports && form.reports.length > 0 ? (
                <div className="space-y-3">
                  {form.reports.map((report, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm mb-2">{report.message}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(report.createdAt)}</span>
                        {report.documents && report.documents.length > 0 && (
                          <span>{report.documents.length} document(s) attached</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No reports sent yet</p>
              )}
            </CardContent>
          </Card>
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
