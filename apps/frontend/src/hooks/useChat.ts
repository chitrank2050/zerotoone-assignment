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

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // 1. Optimistic Update for Messages
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
        // 2. Network Request
        const response = await apiClient.post<
          any,
          { messages: Message[]; signals: Signal[] }
        >(`/chat/${conversationId || 'new'}`, { content });

        // 3. Sync State (Messages and Signals)
        setMessages(response.messages);
        setSignals(response.signals);

        return response;
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsTyping(false);
      }
    },
    [conversationId],
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
  };
};
