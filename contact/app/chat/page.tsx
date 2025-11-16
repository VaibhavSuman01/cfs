"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, User, Loader2, Search, Clock, Menu } from "lucide-react";
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
  user: { _id: string; name: string; email: string };
  subject: string;
  status: string;
  messages: Array<{ sender: string; message: string; timestamp: string; read: boolean }>;
  lastMessageAt: string;
}

export default function SupportChatPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListOpen, setIsListOpen] = useState(true); // for small screens

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const selectedChatIdRef = useRef<string | null>(null);
  const pollingRef = useRef<number | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  // keep ref in sync
  useEffect(() => {
    selectedChatIdRef.current = selectedChat?._id || null;
  }, [selectedChat]);

  const fetchChats = useCallback(async () => {
    setIsLoading(true);
    try {
      fetchAbortRef.current?.abort();
      fetchAbortRef.current = new AbortController();
      const response = await api.get("/api/support-team/chats", {
        signal: fetchAbortRef.current.signal,
      });
      const data = response.data?.data || [];
      setChats(data);

      // if nothing selected, auto-select the most recent open chat
      if (!selectedChatIdRef.current && data.length > 0) {
        const first = data[0];
        setSelectedChat(first);
      } else if (selectedChatIdRef.current) {
        const updated = data.find((c: Chat) => c._id === selectedChatIdRef.current) || null;
        setSelectedChat((prev) => (updated ? updated : prev));
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("fetchChats error", err);
      } else if (err && typeof err === "object" && "name" in err && err.name !== "AbortError") {
        console.error("fetchChats error", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Polling only when window is focused to reduce noise
  useEffect(() => {
    if (!user) return;
    fetchChats();

    const startPolling = () => {
      if (pollingRef.current) return;
      pollingRef.current = window.setInterval(fetchChats, 7000);
    };
    const stopPolling = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };

    startPolling();
    window.addEventListener("focus", startPolling);
    window.addEventListener("blur", stopPolling);

    return () => {
      stopPolling();
      window.removeEventListener("focus", startPolling);
      window.removeEventListener("blur", stopPolling);
      fetchAbortRef.current?.abort();
    };
  }, [user, fetchChats]);

  // scroll when messages change
  useEffect(() => {
    if (selectedChat && selectedChat.messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat]);

  // memoized filtered list + simple debounce for search
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const q = searchQuery.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.user.name.toLowerCase().includes(q) ||
        chat.user.email.toLowerCase().includes(q) ||
        chat.subject.toLowerCase().includes(q)
    );
  }, [chats, searchQuery]);

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  // optimistic UI for sending
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;
    const trimmed = message.trim();
    setIsSending(true);

    // optimistic append
    const optimisticMsg = {
      sender: "support",
      message: trimmed,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setSelectedChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, optimisticMsg], lastMessageAt: optimisticMsg.timestamp } : prev
    );
    setMessage("");

    try {
      await api.post(`/api/support-team/chats/${selectedChat._id}/messages`, { message: trimmed });
      await fetchChats(); // refresh to get server state
    } catch (error) {
      // rollback: remove last message if server failed
      setSelectedChat((prev) =>
        prev ? { ...prev, messages: prev.messages.filter((m) => m !== optimisticMsg) } : prev
      );

      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to send message"
          : "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  // toggle list on small screens
  const toggleList = () => setIsListOpen((s) => !s);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 flex gap-4 sm:gap-6">
        {/* Responsive: left panel collapses on small screens */}
        <aside
          className={`w-80 max-w-[320px] bg-white dark:bg-gray-800 rounded-lg shadow-sm border-r dark:border-gray-700 transition-transform transform ${isListOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
          aria-label="Chat list"
        >
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <button
                className="sm:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleList}
                aria-expanded={isListOpen}
                aria-controls="chat-list"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  aria-label="Search chats"
                  placeholder="Search chats..."
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Support</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{filteredChats.length} chats</span>
            </div>
          </div>

          <div id="chat-list" className="overflow-y-auto h-[calc(100vh-180px)]">
            {filteredChats.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                No chats found
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => {
                    setSelectedChat(chat);
                    if (window.innerWidth < 640) setIsListOpen(false);
                  }}
                  className={`w-full text-left p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start justify-between ${selectedChat?._id === chat._id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div className="min-w-0">
                      <p className="font-medium truncate text-sm text-gray-900 dark:text-white">{chat.user.name}</p>
                      <p className="text-xs truncate text-gray-500 dark:text-gray-400">{chat.user.email}</p>
                      <p className="text-xs truncate text-gray-500 dark:text-gray-400 mt-1">{chat.subject}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className={chat.status === "open" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"}>{chat.status}</Badge>
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(chat.lastMessageAt)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm min-w-0">
          {selectedChat ? (
            <>
              <header className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedChat.user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedChat.user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedChat.status}
                    onValueChange={async (status) => {
                      try {
                        await api.put(`/api/support-team/chats/${selectedChat._id}/status`, { status });
                        await fetchChats();
                        toast.success("Chat status updated");
                      } catch (error) {
                        const errorMessage =
                          error && typeof error === "object" && "response" in error
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
              </header>

              <section className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
                {selectedChat.messages.length === 0 && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    No messages yet. Start the conversation.
                  </div>
                )}

                {selectedChat.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "support" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === "support" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                      <p className="text-sm break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.sender === "support" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </section>

              <footer className="p-4 border-t dark:border-gray-700">
                <div className="flex gap-2">
                  <Input
                    aria-label="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <Button onClick={handleSendMessage} disabled={isSending || !message.trim()} aria-disabled={isSending || !message.trim()}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
