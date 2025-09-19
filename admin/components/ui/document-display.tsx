'use client'

import { useState } from 'react'
import { 
  FileText, 
  Download, 
  Archive, 
  Eye, 
  Calendar,
  User,
  FileIcon,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import api from '@/lib/api-client'

interface Document {
  _id?: string
  fileName?: string
  originalName?: string
  originalname?: string
  documentType?: string
  fileType?: string
  fileSize?: number
  contentType?: string
  mimetype?: string
  uploadDate?: string
  uploadedBy?: string
  name?: string
  size?: number
  path?: string
  filename?: string
}

interface DocumentDisplayProps {
  documents: Document[]
  formId: string
  formType: string
  title?: string
  showBulkDownload?: boolean
  className?: string
}

const getFileIcon = (fileType: string) => {
  const type = fileType?.toLowerCase() || ''
  if (type.includes('pdf')) return '📄'
  if (type.includes('image')) return '🖼️'
  if (type.includes('word') || type.includes('doc')) return '📝'
  if (type.includes('excel') || type.includes('sheet')) return '📊'
  if (type.includes('zip') || type.includes('rar')) return '🗜️'
  return '📎'
}

const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function DocumentDisplay({ 
  documents, 
  formId, 
  formType, 
  title = "User Documents",
  showBulkDownload = true,
  className = ""
}: DocumentDisplayProps) {
  const { toast } = useToast()
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadingAll, setDownloadingAll] = useState(false)

  // Filter to only show user documents (not admin documents)
  const userDocuments = documents.filter(doc => 
    doc.uploadedBy !== 'admin' && 
    doc.documentType !== 'admin-report'
  )

  const handleDownload = async (doc: Document) => {
    try {
      const docId = doc._id || doc.filename
      if (!docId) {
        toast({
          title: 'Error',
          description: 'Document ID not found',
          variant: 'destructive',
        })
        return
      }

      setDownloading(docId)
      
      // Try different download endpoints based on form type
      let downloadUrl = ''
      if (formType === 'TaxForm') {
        downloadUrl = `/api/forms/download/${docId}`
      } else {
        // For other form types, use a generic download endpoint
        downloadUrl = `/api/forms/download/${docId}`
      }

      const response = await api.get(downloadUrl, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', doc.originalName || doc.originalname || doc.fileName || doc.name || 'document')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: 'Success',
        description: 'Document downloaded successfully',
      })
    } catch (error) {
      console.error('Failed to download document:', error)
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive',
      })
    } finally {
      setDownloading(null)
    }
  }

  const handleDownloadAll = async () => {
    try {
      setDownloadingAll(true)
      
      // Create a zip file with all user documents
      const response = await api.post(`/api/forms/download-all/${formId}`, {
        formType,
        documents: userDocuments.map(doc => ({
          id: doc._id,
          name: doc.originalName || doc.fileName || doc.name || 'document',
          type: doc.fileType || doc.contentType || doc.mimetype
        }))
      }, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${formType}_${formId}_documents.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: 'Success',
        description: 'All documents downloaded as ZIP',
      })
    } catch (error) {
      console.error('Failed to download all documents:', error)
      toast({
        title: 'Error',
        description: 'Failed to download documents. Please try downloading individually.',
        variant: 'destructive',
      })
    } finally {
      setDownloadingAll(false)
    }
  }

  if (!userDocuments || userDocuments.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title} (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No user documents uploaded</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title} ({userDocuments.length})
          </CardTitle>
          {showBulkDownload && userDocuments.length > 1 && (
            <Button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              variant="outline"
              size="sm"
            >
              {downloadingAll ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Archive className="mr-2 h-4 w-4" />
              )}
              Download All as ZIP
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {userDocuments.map((doc, index) => {
            const docId = doc._id || doc.filename || `doc-${index}`
            const fileName = doc.originalName || doc.originalname || doc.fileName || doc.name || `Document ${index + 1}`
            const fileSize = doc.fileSize || doc.size || 0
            const fileType = doc.fileType || doc.contentType || doc.mimetype || 'application/octet-stream'
            const uploadDate = doc.uploadDate
            const uploadedBy = doc.uploadedBy || 'user'
            
            return (
              <div key={docId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-2xl">
                    {getFileIcon(fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{fileName}</p>
                      <Badge variant="outline" className="text-xs">
                        {doc.documentType || 'Document'}
                      </Badge>
                      {uploadedBy === 'admin' && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileIcon className="h-3 w-3" />
                        {fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                      </span>
                      <span>{formatFileSize(fileSize)}</span>
                      {uploadDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(uploadDate)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {uploadedBy === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    disabled={downloading === docId}
                  >
                    {downloading === docId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
