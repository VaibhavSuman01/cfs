'use client';

import { MessageSquare } from 'lucide-react';

export function EmptyChatState() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <MessageSquare className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          Select a chat to start messaging
        </p>
      </div>
    </div>
  );
}

