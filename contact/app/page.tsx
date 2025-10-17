'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Search, 
  Filter,
  Plus,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2
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
  createdAt: string;
  response?: string;
}

export default function ContactDashboard() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'replied'>('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/admin/contacts');
      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'new' && !contact.replied) ||
      (filterStatus === 'replied' && contact.replied);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => !c.replied).length,
    replied: contacts.filter(c => c.replied).length,
    today: contacts.filter(c => {
      const today = new Date();
      const contactDate = new Date(c.createdAt);
      return contactDate.toDateString() === today.toDateString();
    }).length
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.new}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Replied</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
              <p className="text-xs text-muted-foreground">Response sent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
              <p className="text-xs text-muted-foreground">Received today</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>View and manage customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'new' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('new')}
                >
                  New
                </Button>
                <Button
                  variant={filterStatus === 'replied' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('replied')}
                >
                  Replied
                </Button>
              </div>
            </div>

            {/* Contact List */}
            <div className="space-y-4">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <Card key={contact._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                            <Badge variant={contact.replied ? 'secondary' : 'default'}>
                              {contact.replied ? 'Replied' : 'New'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">{contact.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span className="text-sm">{contact.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">{formatDate(contact.createdAt)}</span>
                            </div>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Service: </span>
                            <span className="text-sm text-blue-600">{contact.service}</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                          </div>
                        </div>
                        <div className="ml-4 flex flex-col space-y-2">
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => window.location.href = `/contact-detail/${contact._id}`}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.location.href = `/contact-detail/${contact._id}`}
                          >
                            {contact.replied ? 'Reply Again' : 'Reply'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                  <p className="text-gray-500">
                    {searchQuery || filterStatus !== 'all' 
                      ? 'No messages match your current filters' 
                      : 'No contact messages have been received yet'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}