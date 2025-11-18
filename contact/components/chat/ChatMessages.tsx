'use client';

import { useEffect, useRef } from 'react';

interface Message {
  sender: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  formatTime: (dateString: string) => string;
}

export function ChatMessages({ messages, formatTime }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0" aria-live="polite">
      {messages.map((msg, idx) => {
        const isSupport = msg.sender === 'support';
        return (
          <div
            key={idx}
            className={`flex ${isSupport ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 sm:px-4 sm:py-3 shadow-sm ${
                isSupport
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
              }`}
            >
              <p className="text-sm sm:text-base break-words whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </p>
              <p
                className={`text-xs mt-1.5 sm:mt-2 ${
                  isSupport ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
}

