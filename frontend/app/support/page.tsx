"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Send,
  Loader2,
  AlertCircle,
  User,
  Trash2,
  Filter,
} from "lucide-react";
import api from "@/lib/api-client";
import { toast } from "sonner";

interface Contact {
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

export default function SupportTeamPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchContacts();
    }
  }, [user, currentPage, statusFilter, searchQuery]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await api.get(`/api/support/contacts?${params.toString()}`);
      setContacts(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      toast.error("Failed to load support requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedContact || !replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setIsReplying(true);
    try {
      await api.put(`/api/support/contacts/${selectedContact._id}/reply`, {
        replyMessage: replyMessage.trim(),
      });

      toast.success("Reply sent successfully!");
      setReplyMessage("");
      setIsReplyDialogOpen(false);
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsReplying(false);
    }
  };

  const handleMarkReplied = async (contactId: string) => {
    try {
      await api.put(`/api/support/contacts/${contactId}/mark-replied`);
      toast.success("Marked as replied");
      fetchContacts();
    } catch (error) {
      console.error("Failed to mark as replied:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await api.delete(`/api/support/contacts/${contactId}`);
      toast.success("Contact deleted");
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const openReplyDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setReplyMessage("");
    setIsReplyDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const pendingCount = contacts.filter((c) => !c.replied).length;
  const repliedCount = contacts.filter((c) => c.replied).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Support Team Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and respond to customer support requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {contacts.length}
                  </p>
                </div>
                <MessageCircle className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {pendingCount}
                  </p>
                </div>
                <AlertCircle className="h-12 w-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Replied</p>
                  <p className="text-3xl font-bold text-green-600">
                    {repliedCount}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by name, email, phone, or message..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-[200px]">
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

        {/* Contacts List */}
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No support requests found
                </h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "No requests have been submitted yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            contacts.map((contact) => (
              <Card
                key={contact._id}
                className={`${
                  !contact.replied
                    ? "border-l-4 border-l-orange-500"
                    : "border-l-4 border-l-green-500"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-5 w-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {contact.name}
                            </h3>
                            {contact.replied ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Replied
                              </Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-800">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Service: {contact.service}
                        </p>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </div>

                      {contact.replied && contact.replyMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-green-800 mb-2">
                            Reply Sent:
                          </p>
                          <p className="text-sm text-green-700 whitespace-pre-wrap">
                            {contact.replyMessage}
                          </p>
                          {contact.repliedAt && (
                            <p className="text-xs text-green-600 mt-2">
                              Replied on: {formatDate(contact.repliedAt)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:w-auto">
                      {!contact.replied && (
                        <>
                          <Button
                            onClick={() => openReplyDialog(contact)}
                            className="w-full"
                          >
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
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(contact._id)}
                        className="w-full"
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
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
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
            <DialogDescription>
              Send an email response to the user
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Original Message:
                </p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply:
                </label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Enter your reply message..."
                  rows={6}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReplyDialogOpen(false);
                    setReplyMessage("");
                    setSelectedContact(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReply}
                  disabled={isReplying || !replyMessage.trim()}
                >
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

