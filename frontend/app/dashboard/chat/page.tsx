"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Send,
  User,
  Loader2,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";

interface Chat {
  _id: string;
  supportTeam: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  status: string;
  messages: Array<{
    sender: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
  lastMessageAt: string;
}

export default function UserChatPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newChatSubject, setNewChatSubject] = useState("");
  const [newChatMessage, setNewChatMessage] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchChats();
      const interval = setInterval(fetchChats, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const response = await api.get("/api/support-team/user-chats");
      setChats(response.data.data || []);
      if (selectedChat) {
        const updatedChat = response.data.data.find(
          (c: Chat) => c._id === selectedChat._id
        );
        if (updatedChat) {
          setSelectedChat(updatedChat);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async () => {
    if (!newChatSubject.trim() || !newChatMessage.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }

    setIsCreatingChat(true);
    try {
      const response = await api.post("/api/support-team/user-chat", {
        subject: newChatSubject.trim(),
        message: newChatMessage.trim(),
      });

      if (response.data.success) {
        toast.success("Chat created successfully!");
        setIsCreateDialogOpen(false);
        setNewChatSubject("");
        setNewChatMessage("");
        await fetchChats();
        setSelectedChat(response.data.data);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create chat"
      );
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    setIsSending(true);
    try {
      await api.post(
        `/api/support-team/user-chats/${selectedChat._id}/messages`,
        {
          message: message.trim(),
        }
      );
      setMessage("");
      await fetchChats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.supportTeam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-8 w-8" />
              Support Chat
            </h1>
            <p className="text-gray-600 mt-2">
              Chat with our support team for assistance
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredChats.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No chats found</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setIsCreateDialogOpen(true)}
                      >
                        Start New Chat
                      </Button>
                    </div>
                  ) : (
                    filteredChats.map((chat) => (
                      <div
                        key={chat._id}
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedChat?._id === chat._id
                            ? "bg-blue-50 border-l-4 border-l-blue-600"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {chat.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              Support: {chat.supportTeam.name}
                            </p>
                          </div>
                          <Badge
                            className={
                              chat.status === "open"
                                ? "bg-orange-100 text-orange-800"
                                : chat.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {chat.status}
                          </Badge>
                        </div>
                        {chat.messages.length > 0 && (
                          <p className="text-sm text-gray-600 truncate">
                            {chat.messages[chat.messages.length - 1].message}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatTime(chat.lastMessageAt)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedChat.subject}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Support: {selectedChat.supportTeam.name}
                      </p>
                    </div>
                    <Badge>{selectedChat.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedChat.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-md rounded-lg p-3 ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>
                {selectedChat.status === "open" && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isSending || !message.trim()}
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select a chat to start messaging
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Chat
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Chat Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
            <DialogDescription>
              Create a new chat with our support team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <Input
                value={newChatSubject}
                onChange={(e) => setNewChatSubject(e.target.value)}
                placeholder="Enter subject..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <Textarea
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateChat} disabled={isCreatingChat}>
                {isCreatingChat ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Start Chat
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

