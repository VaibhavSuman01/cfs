'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  Calendar, 
  ArrowLeft,
  Send,
  MessageSquare,
  User,
  Building2,
  Clock,
  CheckCircle
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

export default function ContactDetail() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchContactDetail(params.id as string);
    }
  }, [params.id]);

  const fetchContactDetail = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/admin/contacts/${id}`);
      setContact(response.data.contact);
      setReply(response.data.contact.response || '');
    } catch (error) {
      console.error('Failed to fetch contact detail:', error);
      toast.error('Failed to load contact details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!contact || !reply.trim()) {
      toast.error('Please write a response before sending');
      return;
    }

    try {
      setIsReplying(true);
      await api.post(`/api/admin/contacts/${contact._id}/reply`, {
        message: reply.trim(),
      });

      setContact({ ...contact, replied: true, response: reply.trim() });
      toast.success('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply. Please try again.');
    } finally {
      setIsReplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
          <p className="mt-4 text-gray-600">Loading contact details...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact not found</h2>
          <p className="text-gray-600 mb-4">The contact message you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Details</h1>
              <p className="text-gray-600">View and respond to customer inquiry</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="text-lg font-semibold text-gray-900">{contact.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{contact.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{contact.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Service</h3>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {contact.service}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Received</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{formatDate(contact.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge variant={contact.replied ? 'secondary' : 'default'}>
                    {contact.replied ? 'Replied' : 'New'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message and Reply */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Customer Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-line">{contact.message}</p>
                </div>
              </CardContent>
            </Card>

            {/* Previous Response */}
            {contact.response && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Previous Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-line">{contact.response}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reply Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  {contact.replied ? 'Send Another Reply' : 'Send Reply'}
                </CardTitle>
                <CardDescription>
                  {contact.replied 
                    ? 'Send an additional response to this customer'
                    : 'Respond to this customer inquiry'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response
                    </label>
                    <Textarea
                      id="reply"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="min-h-[150px]"
                      placeholder="Type your response here..."
                    />
                  </div>
                  <Button
                    onClick={handleSendReply}
                    disabled={isReplying || !reply.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isReplying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
