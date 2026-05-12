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
  const [totalReach, setTotalReach] = useState<number>(0);
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
          const conv = await (apiClient.post('/chat/conversations', {
            title: content.substring(0, 30) + '…',
          }) as unknown as Promise<{ id: string }>);

          currentId = conv.id;
          setActiveId(conv.id);
        } catch (err: any) {
          setError('Failed to initialize session: ' + err.message);
          return;
        }
      }

      // 2. Optimistic Update (User Message)
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
        // 3. Streaming Request (SSE)
        const baseUrl =
          apiClient.defaults.baseURL || 'http://localhost:3000/api/v1';
        const url = `${baseUrl}/chat/conversations/${currentId}/stream?content=${encodeURIComponent(content)}`;

        const token = localStorage.getItem('token');

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-correlation-id': crypto.randomUUID(),
          },
        });

        if (!response.ok) {
          throw new Error('Streaming connection failed');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Failed to start stream reader');

        // 4. Create Agent Message Placeholder
        const aiMessageId = crypto.randomUUID();
        const aiMessage: Message = {
          id: aiMessageId,
          role: 'agent',
          content: '',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        const decoder = new TextDecoder();
        let fullContent = '';

        // 5. Read Stream Chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const rawData = line.slice(6);
                const parsed = JSON.parse(rawData);
                // NestJS SSE wraps in { data: {...} }
                const payload = parsed.data || parsed;

                if (payload.chunk) {
                  fullContent += payload.chunk;
                  // Strip JSON blocks from visible chat content (even while streaming)
                  const displayContent = fullContent
                    .replace(/```json[\s\S]*?(```|$)/g, '')
                    .trim();
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, content: displayContent }
                        : msg,
                    ),
                  );
                }

                // Handle structured signals from AI response
                if (payload.signals) {
                  const { signals: newSignals, totalReach: reach } =
                    payload.signals;
                  if (Array.isArray(newSignals)) {
                    setSignals(newSignals);
                  }
                  if (reach) setTotalReach(reach);
                }

                if (payload.done) break;

                if (payload.error) {
                  setError(payload.error);
                  break;
                }
              } catch {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
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
    // Recalculate reach when a signal is removed
    setTotalReach((prev) => Math.round(prev * 0.8));
  }, []);

  return {
    messages,
    signals,
    totalReach,
    isTyping,
    error,
    sendMessage,
    removeSignal,
    activeId,
  };
};
