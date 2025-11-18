'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
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
  const [chats, setChats] = useState<any[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  // Helper function to get user roles
  const getUserRoles = () => {
    if (!user) return [];
    return (user as any).roles || ((user as any).role ? [(user as any).role] : []);
  };

  // Helper function to check if user has live_support role
  const hasLiveSupportRole = () => {
    const userRoles = getUserRoles();
    return userRoles.includes('live_support');
  };

  // Fetch chats for live support users
  const fetchChats = useCallback(async () => {
    const userRoles = getUserRoles();
    if (!userRoles.includes('live_support')) return;
    
    try {
      setIsLoadingChats(true);
      const response = await api.get('/api/support-team/chats');
      setChats(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setIsLoadingChats(false);
    }
  }, [user]);

  useEffect(() => {
    const userRoles = getUserRoles();
    if (userRoles.includes('live_support')) {
      fetchChats();
      // Poll for new chats every 5 seconds
      const interval = setInterval(fetchChats, 5000);
      return () => clearInterval(interval);
    }
  }, [user, fetchChats]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Redirect live_support users to chat page

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  const fetchContacts = useCallback(async () => {
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
    } catch (error: unknown) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contact messages');
      // Fallback to admin endpoint if support endpoint doesn't work
      try {
        const fallbackResponse = await api.get('/api/admin/contacts');
        setContacts(fallbackResponse.data.contacts || []);
      } catch {
        console.error('Fallback also failed');
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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
    } catch (error) {
      console.error('Failed to send email:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send email'
        : 'Failed to send email';
      toast.error(errorMessage);
    } finally {
      setIsReplying(false);
    }
  };

  const handleMarkReplied = async (contactId: string) => {
    try {
      await api.put(`/api/support/contacts/${contactId}/mark-replied`);
      toast.success('Marked as replied');
      fetchContacts();
    } catch (error) {
      console.error('Failed to mark as replied:', error);
      toast.error('Failed to update status');
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

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      company_information_support: 'Company Information',
      taxation_support: 'Taxation',
      roc_returns_support: 'ROC Returns',
      other_registration_support: 'Registration',
      advisory_support: 'Advisory',
      reports_support: 'Reports',
      live_support: 'Live Support',
    };
    return roleMap[role] || role;
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

  const userRoles = getUserRoles();
  const isLiveSupport = hasLiveSupportRole();
  const nonLiveSupportRoles = userRoles.filter((r: string) => r !== 'live_support');

  // Live Support Dashboard - Show chat statistics and quick access
  if (isLiveSupport) {
    const chatStats = {
      total: chats.length,
      open: chats.filter((c: any) => c.status === 'open').length,
      resolved: chats.filter((c: any) => c.status === 'resolved').length,
      closed: chats.filter((c: any) => c.status === 'closed').length,
      unread: chats.filter((c: any) => {
        if (!c.messages || c.messages.length === 0) return false;
        const lastMessage = c.messages[c.messages.length - 1];
        return lastMessage.sender === 'user' && !lastMessage.read;
      }).length,
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Live Support Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage live chat conversations with users
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm px-3 py-1">
                Live Support
              </Badge>
            </div>
          </div>

          {/* Stats Cards for Live Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Total Chats</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{chatStats.total}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">All conversations</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Open</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{chatStats.open}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active chats</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Unread</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{chatStats.unread}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">New messages</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{chatStats.resolved}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Closed</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{chatStats.closed}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Archived</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Card */}
          <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Quick Access</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Access your live chat interface to respond to users in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/chat')} 
                className="w-full sm:w-auto"
                size="lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Open Chat Interface
              </Button>
            </CardContent>
          </Card>

          {/* Recent Chats */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Recent Chats</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Your recent conversations with users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingChats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No chats yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start chatting with users to see conversations here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chats.slice(0, 5).map((chat: any) => {
                    const lastMessage = chat.messages && chat.messages.length > 0 
                      ? chat.messages[chat.messages.length - 1] 
                      : null;
                    const hasUnread = lastMessage && lastMessage.sender === 'user' && !lastMessage.read;
                    
                    return (
                      <div
                        key={chat._id}
                        onClick={() => router.push('/chat')}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          hasUnread ? 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-gray-400" />
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {chat.user?.name || 'Unknown User'}
                              </h3>
                              {hasUnread && (
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {chat.subject || 'No subject'}
                            </p>
                            {lastMessage && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                                {lastMessage.message}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              className={
                                chat.status === 'open' 
                                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                  : chat.status === 'resolved'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }
                            >
                              {chat.status}
                            </Badge>
                            {chat.lastMessageAt && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="h-3 w-3" />
                                {formatDate(chat.lastMessageAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {chats.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" onClick={() => router.push('/chat')}>
                        View All Chats ({chats.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // For other roles, show contact form replies dashboard
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Support Team Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {nonLiveSupportRoles.length > 0
                  ? `Manage and respond to ${nonLiveSupportRoles.map((r: string) => getRoleDisplayName(r)).join(', ')} support requests`
                  : "Manage and respond to customer support requests"}
              </p>
            </div>
            {nonLiveSupportRoles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {nonLiveSupportRoles.map((role: string) => (
                  <Badge key={role} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1">
                    {getRoleDisplayName(role)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards - Role-based filtered stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">
                {nonLiveSupportRoles.length > 0 ? "Department Messages" : "Total Messages"}
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.total}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {nonLiveSupportRoles.length > 0
                  ? `${nonLiveSupportRoles.map((r: string) => getRoleDisplayName(r)).join(', ')} only`
                  : "All time"}
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {nonLiveSupportRoles.length > 0
                  ? "In your department"
                  : "Awaiting response"}
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Replied</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.replied}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {nonLiveSupportRoles.length > 0
                  ? "In your department"
                  : "Response sent"}
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Today</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.today}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {nonLiveSupportRoles.length > 0
                  ? "In your department"
                  : "Received today"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Contact Messages</CardTitle>
            <CardDescription className="dark:text-gray-400">
              {nonLiveSupportRoles.length > 0
                ? `View and manage ${nonLiveSupportRoles.map((r: string) => getRoleDisplayName(r)).join(', ')} customer inquiries`
                : "View and manage customer inquiries"}
            </CardDescription>
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
