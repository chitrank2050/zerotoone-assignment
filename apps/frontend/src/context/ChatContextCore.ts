import { createContext, useContext } from 'react';

import type { Message, Signal } from '@audience-builder/shared';

export interface ChatState {
  messages: Message[];
  signals: Signal[];
  isTyping: boolean;
  error: string | null;
  activeId?: string;
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<any>;
  removeSignal: (id: string) => void;
}

export interface ChatContextValue {
  state: ChatState;
  actions: ChatActions;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
