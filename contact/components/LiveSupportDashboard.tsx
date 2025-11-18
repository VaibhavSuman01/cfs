'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  User,
  Loader2,
} from 'lucide-react';

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

interface LiveSupportDashboardProps {
  chats: Chat[];
  isLoadingChats: boolean;
  formatDate: (dateString: string) => string;
}

export function LiveSupportDashboard({ 
  chats, 
  isLoadingChats, 
  formatDate 
}: LiveSupportDashboardProps) {
  const router = useRouter();

  const chatStats = {
    total: chats.length,
    open: chats.filter((c: Chat) => c.status === 'open').length,
    resolved: chats.filter((c: Chat) => c.status === 'resolved').length,
    closed: chats.filter((c: Chat) => c.status === 'closed').length,
    unread: chats.filter((c: Chat) => {
      if (!c.messages || c.messages.length === 0) return false;
      const lastMessage = c.messages[c.messages.length - 1];
      return lastMessage.sender === 'user' && !lastMessage.read;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Live Chat Support</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage live chat conversations with users
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm px-3 py-1">
          Live Support
        </Badge>
      </div>

      {/* Stats Cards for Live Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{chatStats.total}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">All conversations</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{chatStats.open}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active chats</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{chatStats.unread}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">New messages</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{chatStats.resolved}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-white">Closed</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{chatStats.closed}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Archived</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Card */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Quick Access</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Access your live chat interface to respond to users in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => router.push('/chat')} 
            className="w-full sm:w-auto"
            size="lg"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Open Chat Interface
          </Button>
        </CardContent>
      </Card>

      {/* Recent Chats */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Recent Chats</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Your recent conversations with users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingChats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No chats yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start chatting with users to see conversations here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {chats.slice(0, 5).map((chat: Chat) => {
                const lastMessage = chat.messages && chat.messages.length > 0 
                  ? chat.messages[chat.messages.length - 1] 
                  : null;
                const hasUnread = lastMessage && lastMessage.sender === 'user' && !lastMessage.read;
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => router.push('/chat')}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      hasUnread ? 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {chat.user?.name || 'Unknown User'}
                          </h3>
                          {hasUnread && (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {chat.subject || 'No subject'}
                        </p>
                        {lastMessage && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                            {lastMessage.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          className={
                            chat.status === 'open' 
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                              : chat.status === 'resolved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }
                        >
                          {chat.status}
                        </Badge>
                        {chat.lastMessageAt && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {formatDate(chat.lastMessageAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {chats.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => router.push('/chat')}>
                    View All Chats ({chats.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

