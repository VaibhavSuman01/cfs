"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Circle, Clock, Download, FileText, Mail, Phone, User, X, AlertCircle, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api-client';
import { API_PATHS } from '@/lib/api-client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface Document {
  _id: string;
  fileName?: string;
  originalName?: string;
  documentType?: string;
  fileType?: string;
  fileSize?: number;
  contentType?: string;
  isEdited?: boolean;
  name?: string; // For backward compatibility
  path?: string; // For backward compatibility
}

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  documents: Document[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  createdAt: string;
  updatedAt?: string;
}

const StatusBadge = ({ status }: { status: Service['status'] }) => {
  const statusConfig = {
    Pending: {
      variant: 'secondary',
      icon: <Clock className="mr-1 h-3 w-3" />,
      label: 'Pending',
    },
    'In Progress': {
      variant: 'default',
      icon: <AlertCircle className="mr-1 h-3 w-3" />,
      label: 'In Progress',
    },
    Completed: {
      variant: 'default',
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
      label: 'Completed',
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

export default function ServiceDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [nextStatus, setNextStatus] = useState<Service['status'] | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        try {
          // This will need to be updated with the actual API endpoint
          const response = await api.get(`/api/admin/services/${id}`);
          
          // Check if response.data is an object with a data property
          if (response.data && response.data.data && typeof response.data.data === 'object') {
            // If API returns { data: { ... } } structure, use the nested data
            setService(response.data.data);
          } else {
            // Otherwise use the response data directly
            setService(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch service:', error);
          toast({ title: 'Error', description: 'Failed to load service details.', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };
      fetchService();
    }
  }, [id, toast]);

  const handleUpdateStatus = async () => {
    if (!nextStatus) return;
    setUpdatingStatus(true);
    try {
      // This will need to be updated with the actual API endpoint
      await api.put(`/api/admin/services/${id}/status`, { status: nextStatus });
      setService(prev => prev ? { ...prev, status: nextStatus } : null);
      toast({ title: 'Success', description: `Status updated to ${nextStatus}.` });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    } finally {
      setUpdatingStatus(false);
      setShowConfirmDialog(false);
    }
  };

  const promptUpdateStatus = (status: Service['status']) => {
    setNextStatus(status);
    setShowConfirmDialog(true);
  };

  const handleDownload = async (doc: Document) => {
    if (!doc || !doc._id) {
      toast({ title: 'Download Failed', description: 'Invalid document information.', variant: 'destructive' });
      return;
    }
    
    try {
      // Use the correct API path for document downloads
      const fileName = doc.originalName || doc.fileName || doc.name || `document-${doc._id}`;
      
      // Use the downloadFile method from the API client which handles authentication
      await api.downloadFile(`/api/admin/services/${id}/documents/${doc._id}`, fileName);
      
      toast({ title: 'Download Started', description: `Downloading ${fileName}` });
    } catch (error) {
      console.error('Download error:', error);
      toast({ title: 'Download Failed', description: 'Could not download the file.', variant: 'destructive' });
    }
  };

  const handleSendReport = async () => {
    try {
      // This will need to be updated with the actual API endpoint
      await api.post(`/api/admin/services/${id}/send-report`, {
        reportType: 'confirmation',
        message: 'Your service request has been processed. Please find the attached report.',
        // You can add document IDs to attach to the email
        attachmentIds: service?.documents.map(doc => doc._id) || []
      });
      
      toast({ title: 'Success', description: 'Report sent to client successfully.' });
    } catch (error) {
      console.error('Failed to send report:', error);
      toast({ title: 'Error', description: 'Failed to send report.', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!service) {
    return <div className="container mx-auto p-6 text-center">Service not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Category: {service.category} | Created: {new Date(service.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <StatusBadge status={service.status} />
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold">Service Description</h3>
                      <p>{service.description}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents" className="space-y-4 mt-4">
                    <h3 className="text-lg font-semibold">Documents</h3>
                    {service.documents && service.documents.length > 0 ? (
                      <div className="space-y-2">
                        {service.documents.map((doc) => (
                          <Card key={doc._id} className="p-4 flex justify-between items-center">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-blue-500" />
                              <div>
                                <p className="font-medium">{doc.originalName || doc.fileName || doc.name || 'Unnamed Document'}</p>
                                <p className="text-sm text-muted-foreground">
                                  {doc.documentType || 'Unknown Type'} • {doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : 'Unknown size'}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No documents available.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="reports" className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Reports</h3>
                      <Button onClick={handleSendReport}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Report to Client
                      </Button>
                    </div>
                    <p className="text-muted-foreground">Send confirmation reports and other documents to the client.</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Client Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{service.clientName}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{service.clientEmail}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{service.clientPhone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Update Status</h4>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant={service.status === 'Pending' ? 'default' : 'outline'}
                      onClick={() => promptUpdateStatus('Pending')}
                      disabled={service.status === 'Pending'}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Mark as Pending
                    </Button>
                    <Button 
                      variant={service.status === 'In Progress' ? 'default' : 'outline'}
                      onClick={() => promptUpdateStatus('In Progress')}
                      disabled={service.status === 'In Progress'}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Mark as In Progress
                    </Button>
                    <Button 
                      variant={service.status === 'Completed' ? 'default' : 'outline'}
                      onClick={() => promptUpdateStatus('Completed')}
                      disabled={service.status === 'Completed'}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Status Update Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status to {nextStatus}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={updatingStatus}>
              {updatingStatus ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}