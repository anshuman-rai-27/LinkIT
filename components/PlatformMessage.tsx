"use client";
import { useState, useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';

interface PlatformMessage {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  admin: {
    name: string | null;
    user: {
      email: string;
    };
  };
}

export default function PlatformMessage() {
  const [messages, setMessages] = useState<PlatformMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedMessages, setDismissedMessages] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPlatformMessages();
  }, []);

  const fetchPlatformMessages = async () => {
    try {
      console.log('Fetching platform messages...');
      const response = await fetch('/api/platform-messages');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received messages:', data);
        setMessages(data.messages || []);
      } else {
        console.error('Failed to fetch messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching platform messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissMessage = (messageId: number) => {
    setDismissedMessages(prev => new Set([...prev, messageId]));
  };

  if (loading) {
    return null;
  }

  const activeMessages = messages.filter(msg => !dismissedMessages.has(msg.id));

  if (activeMessages.length === 0) {
    return null;
  }

  // Only show the most recent message
  const latestMessage = activeMessages[0];

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          key={latestMessage.id}
          className="py-3 flex items-start justify-between gap-4"
        >
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 mt-0.5">
              <Megaphone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-blue-900">
                  {latestMessage.title}
                </h3>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                {latestMessage.content}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                <span>
                  Posted by {latestMessage.admin.name || latestMessage.admin.user.email}
                </span>
                <span>
                  {new Date(latestMessage.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => dismissMessage(latestMessage.id)}
            className="flex-shrink-0 p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 