import type { ReactNode } from 'react';

import { useChat } from '../hooks/useChat';
import { ChatContext, type ChatContextValue } from './ChatContextCore';

interface ChatProviderProps {
  children: ReactNode;
  conversationId?: string;
}

export const ChatProvider = ({
  children,
  conversationId,
}: ChatProviderProps) => {
  const {
    messages,
    signals,
    isTyping,
    error,
    sendMessage,
    removeSignal,
    activeId,
  } = useChat(conversationId);

  const value: ChatContextValue = {
    state: {
      messages,
      signals,
      isTyping,
      error,
      activeId,
    },
    actions: {
      sendMessage,
      removeSignal,
    },
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
