import { useCallback, useState } from 'react';

import type { Message, Signal } from '@audience-builder/shared';

import apiClient from '../api/client';

/**
 * Principal-Grade Chat Hook
 *
 * Orchestrates the complex state of an AI conversation,
 * including optimistic updates and signal synchronization.
 */
export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | undefined>(conversationId);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      let currentId = activeId;

      // 1. Initialize session if it's the first message
      if (!currentId) {
        try {
          // The apiClient interceptor returns data.data, so we cast to the inner type
          const conv = await (apiClient.post('/chat/conversations', {
            title: content.substring(0, 30) + '...',
          }) as unknown as Promise<{ id: string }>);

          currentId = conv.id;
          setActiveId(conv.id);
        } catch (err: any) {
          setError('Failed to initialize session: ' + err.message);
          return;
        }
      }

      // 2. Optimistic Update
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setError(null);

      try {
        // 3. Network Request to synchronized route
        // Backend ChatController expects { text: string }
        const response = await (apiClient.post(
          `/chat/conversations/${currentId}/messages`,
          {
            text: content,
          },
        ) as unknown as Promise<{ messages: Message[]; signals: Signal[] }>);

        // 4. Sync State (Messages and Signals)
        setMessages(response.messages);
        setSignals(response.signals);

        return response;
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsTyping(false);
      }
    },
    [activeId],
  );

  const removeSignal = useCallback((id: string) => {
    setSignals((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    messages,
    signals,
    isTyping,
    error,
    sendMessage,
    removeSignal,
    activeId,
  };
};
