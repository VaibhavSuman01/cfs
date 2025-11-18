'use client';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Clock, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Chat {
  _id: string;
  user: { _id: string; name: string; email: string };
  subject: string;
  status: string;
  messages: Array<{ sender: string; message: string; timestamp: string; read: boolean }>;
  lastMessageAt: string;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectChat: (chat: Chat) => void;
  isListOpen: boolean;
  onToggleList: () => void;
  formatTime: (dateString: string) => string;
  userRole?: string;
  getRoleDisplayName: (role: string) => string;
}

export function ChatList({
  chats,
  selectedChat,
  searchQuery,
  setSearchQuery,
  onSelectChat,
  isListOpen,
  onToggleList,
  formatTime,
  userRole,
  getRoleDisplayName,
}: ChatListProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isListOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={onToggleList}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:relative inset-y-0 left-0 z-50 sm:z-auto w-80 max-w-[85vw] sm:max-w-[320px] bg-white dark:bg-gray-800 rounded-r-lg sm:rounded-lg shadow-lg sm:shadow-sm border-r dark:border-gray-700 transition-transform duration-300 ease-in-out ${
          isListOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
        aria-label="Chat list"
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={onToggleList}
                aria-label="Close chat list"
              >
                <X className="h-5 w-5" />
              </Button>
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
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Support</h2>
                {userRole && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {getRoleDisplayName(userRole)}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{chats.length} chats</span>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto overscroll-contain -mr-1 pr-1">
            {chats.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                No chats found
              </div>
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {chats.map((chat) => {
                  const isSelected = selectedChat?._id === chat._id;
                  const lastMessage = chat.messages && chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1] 
                    : null;
                  const hasUnread = lastMessage && lastMessage.sender === 'user' && !lastMessage.read;

                  return (
                    <button
                      key={chat._id}
                      onClick={() => {
                        onSelectChat(chat);
                        if (window.innerWidth < 640) onToggleList();
                      }}
                      className={`w-full text-left p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                              {chat.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`font-medium truncate text-sm ${isSelected ? 'text-blue-900 dark:text-blue-200' : 'text-gray-900 dark:text-white'}`}>
                              {chat.user.name}
                            </p>
                            {hasUnread && (
                              <span className="flex-shrink-0 h-2 w-2 bg-blue-500 rounded-full ml-2" />
                            )}
                          </div>
                          <p className="text-xs truncate text-gray-500 dark:text-gray-400 mb-1">
                            {chat.user.email}
                          </p>
                          <p className="text-xs truncate text-gray-500 dark:text-gray-400 mb-2">
                            {chat.subject}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              className={`text-xs ${
                                chat.status === 'open'
                                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                  : chat.status === 'resolved'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {chat.status}
                            </Badge>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(chat.lastMessageAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

