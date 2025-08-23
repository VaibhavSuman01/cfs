'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Mail, MoreHorizontal, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  replied: boolean;
  createdAt: string;
  response?: string; // This can be used to store the last reply sent
}

export default function ContactsPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoadingContacts(true);
        const response = await api.get('/api/admin/contacts');
        setContacts(response.data.contacts || []);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        toast.error('Failed to load contact messages. Please try again.');
      } finally {
        setIsLoadingContacts(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchContacts();
    }
  }, [user]);

  const handleSendReply = async () => {
    if (!selectedContact || !response.trim()) {
      toast.error('Please write a response before sending.');
      return;
    }

    try {
      await api.post(`/api/admin/contacts/${selectedContact._id}/reply`, {
        message: response.trim(),
      });

      // Update local state
      setContacts(contacts.map(contact => 
        contact._id === selectedContact._id ? { ...contact, replied: true, response: response.trim() } : contact
      ));

      setIsDialogOpen(false);
      setResponse('');
      toast.success('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply. Please try again.');
    }
  };

  const openContactDetails = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setResponse(contact.response || '');
    setIsDialogOpen(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.phone.toLowerCase().includes(searchLower) ||
      contact.service.toLowerCase().includes(searchLower) ||
      contact.message.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoadingContacts) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">Contact Messages</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>Manage and respond to user inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingContacts ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact._id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.service}</TableCell>
                      <TableCell>{formatDate(contact.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={contact.replied ? 'secondary' : 'default'}>
                          {contact.replied ? 'Replied' : 'New'}
                        </Badge>
                      </TableCell><TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openContactDetails(contact)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              View Message
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openContactDetails(contact)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              {contact.replied ? 'View & Reply Again' : 'View & Reply'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <Mail className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {searchQuery ? 'No messages match your search' : 'No contact messages found'}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Contact Details Dialog */}
      {selectedContact && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Contact Message</DialogTitle>
              <DialogDescription>
                View and respond to this contact message
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                  <p className="text-base font-medium">{selectedContact.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p className="text-base">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p className="text-base">{selectedContact.phone}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Service</h3>
                <p className="text-base">{selectedContact.service}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="text-base whitespace-pre-line">{selectedContact.message}</p>
                </div>
              </div>

              {selectedContact.response && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Response Sent</h3>
                  <div className="mt-1 p-3 bg-primary/10 rounded-md">
                    <p className="text-base whitespace-pre-line">{selectedContact.response}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="response">{selectedContact.replied ? 'Send Another Reply' : 'Response'}</Label>
                <Textarea
                  id="response"
                  placeholder="Type your response here..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendReply}>
                <Mail className="mr-2 h-4 w-4" />
                Send Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}