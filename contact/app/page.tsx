'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Search, 
  Filter,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
  Trash2,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api-client';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  replied: boolean;
  repliedAt?: string;
  repliedBy?: string;
  replyMessage?: string;
  createdAt: string;
}

export default function SupportTeamDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [currentPage, statusFilter, searchQuery]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await api.get(`/api/support/contacts?${params.toString()}`);
      setContacts(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error: any) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contact messages');
      // Fallback to admin endpoint if support endpoint doesn't work
      try {
        const fallbackResponse = await api.get('/api/admin/contacts');
        setContacts(fallbackResponse.data.contacts || []);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedContact || !replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setIsReplying(true);
    try {
      // Send email to user
      await api.post('/api/support-team/send-email', {
        contactId: selectedContact._id,
        subject: `Re: ${selectedContact.service} - Response from Com Financial Services`,
        message: replyMessage.trim(),
      });

      toast.success('Email sent successfully!');
      setReplyMessage('');
      setIsReplyDialogOpen(false);
      setSelectedContact(null);
      fetchContacts();
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast.error(error.response?.data?.message || 'Failed to send email');
    } finally {
      setIsReplying(false);
    }
  };

  const handleMarkReplied = async (contactId: string) => {
    try {
      await api.put(`/api/support/contacts/${contactId}/mark-replied`);
      toast.success('Marked as replied');
      fetchContacts();
    } catch (error: any) {
      console.error('Failed to mark as replied:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await api.delete(`/api/support/contacts/${contactId}`);
      toast.success('Contact deleted');
      fetchContacts();
    } catch (error: any) {
      console.error('Failed to delete contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const openReplyDialog = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setReplyMessage('');
    setIsReplyDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: contacts.length,
    pending: contacts.filter(c => !c.replied).length,
    replied: contacts.filter(c => c.replied).length,
    today: contacts.filter(c => {
      const today = new Date();
      const contactDate = new Date(c.createdAt);
      return contactDate.toDateString() === today.toDateString();
    }).length
  };

  if (authLoading || (isLoading && contacts.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading contact messages...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Support Team Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and respond to customer support requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.total}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">All time</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Replied</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.replied}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Response sent</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Today</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.today}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Received today</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Contact Messages</CardTitle>
            <CardDescription className="dark:text-gray-400">View and manage customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, phone, or message..."
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: 'all' | 'pending' | 'replied') => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contact List */}
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No support requests found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No requests have been submitted yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            contacts.map((contact) => (
              <Card
                key={contact._id}
                className={`${
                  !contact.replied
                    ? 'border-l-4 border-l-orange-500'
                    : 'border-l-4 border-l-green-500'
                } hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-5 w-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
                            {contact.replied ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Replied
                              </Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {contact.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {contact.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(contact.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Service: <span className="text-blue-600 dark:text-blue-400">{contact.service}</span>
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{contact.message}</p>
                        </div>
                      </div>

                      {contact.replied && contact.replyMessage && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Reply Sent:</p>
                          <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">{contact.replyMessage}</p>
                          {contact.repliedAt && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                              Replied on: {formatDate(contact.repliedAt)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:w-auto">
                      {!contact.replied && (
                        <>
                          <Button onClick={() => openReplyDialog(contact)} className="w-full">
                            <Send className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleMarkReplied(contact._id)}
                            className="w-full"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Replied
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contact._id)}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedContact?.name}</DialogTitle>
            <DialogDescription>Send an email response to the user</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Message:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Reply:</label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Enter your reply message..."
                  rows={6}
                  className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReplyDialogOpen(false);
                    setReplyMessage('');
                    setSelectedContact(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleReply} disabled={isReplying || !replyMessage.trim()}>
                  {isReplying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
