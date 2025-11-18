"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Menu } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ChatList } from "@/components/chat/ChatList";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { EmptyChatState } from "@/components/chat/EmptyChatState";

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
  const [isListOpen, setIsListOpen] = useState(false); // Start closed on mobile, open on desktop

  const selectedChatIdRef = useRef<string | null>(null);
  const pollingRef = useRef<number | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);

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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    } else if (!authLoading && user && !hasLiveSupportRole()) {
      router.push("/"); // Redirect non-live_support users to main dashboard
    }
  }, [user, authLoading, router, hasLiveSupportRole]);

  // Auto-open list on desktop, keep closed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsListOpen(true);
      } else {
        setIsListOpen(false);
      }
    };
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // keep ref in sync
  useEffect(() => {
    selectedChatIdRef.current = selectedChat?._id || null;
  }, [selectedChat]);

  const fetchChats = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    }
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
      // Ignore abort/cancel errors (expected during cleanup or request cancellation)
      if (err instanceof Error) {
        if (err.name === "AbortError" || err.name === "CanceledError") {
          return;
        }
      }
      if (err && typeof err === "object") {
        const errorObj = err as { name?: string; code?: string };
        if (errorObj.name === "AbortError" || errorObj.name === "CanceledError" || errorObj.code === "ERR_CANCELED") {
          return;
        }
      }

      // Log error for debugging (only if not a cancellation)
      console.error("fetchChats error", err);

      // Show user-friendly error message
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to load chats"
          : "Failed to load chats";

      // Only show toast on initial load to avoid spamming during polling
      if (isInitialLoad) {
        toast.error(errorMessage);
      }
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  }, []);

  // Polling only when window is focused to reduce noise
  useEffect(() => {
    if (!user) return;
    fetchChats(true); // Initial load

    const startPolling = () => {
      if (pollingRef.current) return;
      pollingRef.current = window.setInterval(() => fetchChats(false), 7000);
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

  const getUserRole = (): string => {
    const userRoles = getUserRoles();
    // Return the first role, or 'live_support' as default
    return userRoles[0] || 'live_support';
  };

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
      await fetchChats(false); // refresh to get server state (not initial load)
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

  const handleStatusChange = async (status: string) => {
    if (!selectedChat) return;
    try {
      await api.put(`/api/support-team/chats/${selectedChat._id}/status`, { status });
      await fetchChats(false);
      toast.success("Chat status updated");
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update status"
          : "Failed to update status";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden gap-2 sm:gap-4 p-2 sm:p-4">
        {/* Chat List Sidebar */}
        <ChatList
          chats={filteredChats}
          selectedChat={selectedChat}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectChat={setSelectedChat}
          isListOpen={isListOpen}
          onToggleList={toggleList}
          formatTime={formatTime}
          userRole={getUserRole()}
          getRoleDisplayName={getRoleDisplayName}
        />

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm min-w-0 overflow-hidden">
          {selectedChat ? (
            <>
              <ChatHeader
                chat={selectedChat}
                onStatusChange={handleStatusChange}
                onToggleList={toggleList}
              />
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ChatMessages
                  messages={selectedChat.messages}
                  formatTime={formatTime}
                />
              </div>
              <ChatInput
                message={message}
                setMessage={setMessage}
                onSend={handleSendMessage}
                isSending={isSending}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Show menu button on mobile when no chat is selected */}
              <div className="p-3 sm:p-4 border-b dark:border-gray-700 sm:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleList}
                  aria-label="Open chat list"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <EmptyChatState />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
