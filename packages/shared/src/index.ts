export const UserRole = {
  ADMIN: 'admin',
  PLANNER: 'planner',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Message {
  id?: string;
  conversationId?: string;
  role: 'user' | 'agent';
  content: string;
  createdAt?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  updatedAt: string;
  messages?: Message[];
}

export interface Signal {
  id: string;
  name: string;
  path: string;
  type: 'location' | 'transaction' | 'cg';
}

export interface AudienceEstimate {
  signals: Signal[];
  reachableUsers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}
