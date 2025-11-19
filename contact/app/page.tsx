'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api-client';
import { LiveSupportDashboard } from '@/components/LiveSupportDashboard';
import { ContactRepliesDashboard } from '@/components/ContactRepliesDashboard';

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

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface Chat {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  status: 'open' | 'resolved' | 'closed';
  messages: ChatMessage[];
  lastMessageAt: string;
}

export default function SupportTeamDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isInitialChatLoad, setIsInitialChatLoad] = useState(true);

  // Helper function to get user roles
  const getUserRoles = useCallback((): string[] => {
    if (!user) return [];
    const userWithRoles = user as { roles?: string[]; role?: string };
    return userWithRoles.roles || (userWithRoles.role ? [userWithRoles.role] : []);
  }, [user]);

  // Helper function to check if user has live_support role
  const hasLiveSupportRole = useCallback((): boolean => {
    const userRoles = getUserRoles();
    return userRoles.includes('live_support');
  }, [getUserRoles]);

  // Fetch chats for live support users
  // silent: if true, don't show loading state (for background refresh)
  const fetchChats = useCallback(async (silent: boolean = false) => {
    const userRoles = getUserRoles();
    if (!userRoles.includes('live_support')) return;
    
    try {
      // Only show loading on initial load, not on background refresh
      if (!silent) {
        setIsLoadingChats(true);
      }
      const response = await api.get('/api/support-team/chats');
      setChats(response.data.data || []);
      // Mark initial load as complete after first successful fetch
      if (isInitialChatLoad) {
        setIsInitialChatLoad(false);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      // Only show error toast on initial load, not on silent refresh
      if (!silent) {
        toast.error('Failed to load chats');
      }
    } finally {
      if (!silent) {
        setIsLoadingChats(false);
      }
    }
  }, [getUserRoles, isInitialChatLoad]);

  useEffect(() => {
    const userRoles = getUserRoles();
    if (userRoles.includes('live_support')) {
      // Initial load - show loading
      fetchChats(false);
      // Poll for new chats every 5 seconds - silent background refresh
      const interval = setInterval(() => fetchChats(true), 5000);
      return () => clearInterval(interval);
    }
  }, [getUserRoles, fetchChats]);

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

  if (authLoading || (isLoading && contacts.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
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

  // Show both dashboards if user has both live_support and other roles
  const showLiveSupport = isLiveSupport;
  const showContactReplies = nonLiveSupportRoles.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Support Team Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {showLiveSupport && showContactReplies
              ? 'Manage live chats and contact form replies'
              : showLiveSupport
              ? 'Manage live chat conversations with users'
              : 'Manage and respond to customer support requests'}
          </p>
        </div>

        {/* Live Support Dashboard Section */}
        {showLiveSupport && (
          <div className="mb-12">
            <LiveSupportDashboard
              chats={chats}
              isLoadingChats={isLoadingChats && isInitialChatLoad}
              formatDate={formatDate}
            />
          </div>
        )}

        {/* Contact Form Replies Dashboard Section */}
        {showContactReplies && (
          <div className={showLiveSupport ? 'border-t border-gray-200 dark:border-gray-700 pt-12' : ''}>
            <ContactRepliesDashboard
              contacts={contacts}
              isLoading={isLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
              isReplying={isReplying}
              setIsReplying={setIsReplying}
              isReplyDialogOpen={isReplyDialogOpen}
              setIsReplyDialogOpen={setIsReplyDialogOpen}
              fetchContacts={fetchContacts}
              formatDate={formatDate}
              getRoleDisplayName={getRoleDisplayName}
              nonLiveSupportRoles={nonLiveSupportRoles}
            />
          </div>
        )}
      </div>
    </div>
  );
}
