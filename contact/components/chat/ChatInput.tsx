'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
  isSending: boolean;
  disabled?: boolean;
}

export function ChatInput({ message, setMessage, onSend, isSending, disabled }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && message.trim() && !isSending) {
        onSend();
      }
    }
  };

  return (
    <footer className="p-3 sm:p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
      <div className="flex gap-2">
        <Input
          aria-label="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
          disabled={disabled || isSending}
        />
        <Button
          onClick={onSend}
          disabled={isSending || !message.trim() || disabled}
          size="icon"
          className="flex-shrink-0"
          aria-label="Send message"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          ) : (
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>
    </footer>
  );
}

