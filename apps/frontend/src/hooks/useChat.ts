import { useCallback, useEffect, useState } from 'react';

import type { Message, Signal } from '@audience-builder/shared';

import apiClient from '../api/client';

export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [totalReach, setTotalReach] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from props, then fallback to sessionStorage
  const [activeId, setActiveId] = useState<string | undefined>(
    conversationId || sessionStorage.getItem('activeChatId') || undefined,
  );

  // Update sessionStorage whenever activeId changes
  useEffect(() => {
    if (activeId) {
      sessionStorage.setItem('activeChatId', activeId);
    }
  }, [activeId]);

  // Rehydrate chat history on mount if we have an activeId
  useEffect(() => {
    if (!activeId) return;

    const hydrateChat = async () => {
      try {
        const response = await apiClient.get<Message[]>(
          `/chat/conversations/${activeId}/messages`,
        );
        const history = response.data;

        // Strip JSON blocks for UI display
        const displayMessages = history.map((msg) => ({
          ...msg,
          content:
            msg.role === 'agent'
              ? msg.content.replace(/```json[\s\S]*?(```|$)/g, '').trim()
              : msg.content,
        }));
        setMessages(displayMessages);

        // Extract signals from the LAST agent message to restore Explorer state
        const lastAgentMsg = [...history]
          .reverse()
          .find((m) => m.role === 'agent');
        if (lastAgentMsg) {
          const match = lastAgentMsg.content.match(
            /```json\s*([\s\S]*?)\s*```/,
          );
          if (match?.[1]) {
            const parsed = JSON.parse(match[1]);
            if (parsed.signals) setSignals(parsed.signals);
            if (parsed.totalReach) setTotalReach(parsed.totalReach);
          }
        }
      } catch (err) {
        console.error('Failed to hydrate chat:', err);
        // If the chat doesn't exist anymore, clear it
        sessionStorage.removeItem('activeChatId');
        setActiveId(undefined);
      }
    };

    hydrateChat();
  }, [activeId]);

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
