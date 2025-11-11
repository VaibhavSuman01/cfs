"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  User,
  Loader2,
  Search,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";

interface Chat {
  _id: string;
  user: {
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

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const fetchChats = useCallback(async () => {
    try {
      const response = await api.get("/api/support-team/chats");
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
  }, [selectedChat]);

  useEffect(() => {
    if (user) {
      fetchChats();
      const interval = setInterval(fetchChats, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [user, fetchChats]);

  useEffect(() => {
    if (selectedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    setIsSending(true);
    try {
      await api.post(`/api/support-team/chats/${selectedChat._id}/messages`, {
        message: message.trim(),
      });
      setMessage("");
      await fetchChats();
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to send message"
        : "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
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
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Support Chats ({filteredChats.length})
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No chats found</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedChat?._id === chat._id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {chat.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {chat.user.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      chat.status === "open"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }
                  >
                    {chat.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {chat.subject}
                </p>
                {chat.messages.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {chat.messages[chat.messages.length - 1].message}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatTime(chat.lastMessageAt)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {selectedChat.user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedChat.user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedChat.status}
                    onValueChange={async (status) => {
                      try {
                        await api.put(
                          `/api/support-team/chats/${selectedChat._id}/status`,
                          { status }
                        );
                        await fetchChats();
                        toast.success("Chat status updated");
                      } catch (error) {
                        const errorMessage = error && typeof error === 'object' && 'response' in error
                          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update status"
                          : "Failed to update status";
                        toast.error(errorMessage);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "support" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md rounded-lg p-3 ${
                      msg.sender === "support"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "support"
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

