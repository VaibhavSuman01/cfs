'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Menu } from 'lucide-react';

interface Chat {
  _id: string;
  user: { _id: string; name: string; email: string };
  subject: string;
  status: string;
}

interface ChatHeaderProps {
  chat: Chat;
  onStatusChange: (status: string) => void;
  onToggleList: () => void;
}

export function ChatHeader({ chat, onStatusChange, onToggleList }: ChatHeaderProps) {
  return (
    <header className="p-3 sm:p-4 border-b dark:border-gray-700 flex items-center justify-between flex-shrink-0 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden flex-shrink-0"
          onClick={onToggleList}
          aria-label="Open chat list"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {chat.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
              {chat.user.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              {chat.user.email}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Select value={chat.status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[120px] sm:w-[140px] text-xs sm:text-sm">
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
  );
}

