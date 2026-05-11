/**
 * @audience-builder/shared
 *
 * Single Source of Truth (SSoT) for the Audience Builder Monorepo.
 *
 * Purpose:
 *   Ensures perfect type synchronization between the NestJS backend and
 *   the React frontend. All data structures that cross the network boundary
 *   must be defined here.
 *
 * Contents:
 *   - Identity: User & Role definitions.
 *   - Conversations: Chat thread & Message interfaces.
 *   - Taxonomy: Targeting signals & Estimation results.
 *   - API: Standardized response wrappers.
 */

/**
 * User roles for platform-wide authorization.
 */
export const UserRole = {
  ADMIN: 'admin',
  PLANNER: 'planner',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Core User Profile.
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Conversational Message - Optimistic UI compatible.
 */
export interface Message {
  id?: string;
  conversationId?: string;
  role: 'user' | 'agent';
  content: string;
  createdAt?: string;
}

/**
 * Audience Build Session metadata.
 */
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  updatedAt: string;
  messages?: Message[];
}

/**
 * Targeting Signal from the taxonomy.
 */
export interface Signal {
  id: string;
  name: string;
  path: string;
  type: 'location' | 'transaction' | 'cg';
}

/**
 * Real-time reachability results.
 */
export interface AudienceEstimate {
  signals: Signal[];
  reachableUsers: number;
}

/**
 * Standardized API Response Wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

/**
 * --- Request DTOs ---
 * Defined here for cross-workspace reuse.
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SendMessageRequest {
  content: string;
}

/**
 * --- Error Keys ---
 * Shared keys for consistent error handling.
 */
export const ErrorKeys = {
  AUTH: {
    USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  },
  CHAT: {
    CONVERSATION_NOT_FOUND: 'CHAT_CONVERSATION_NOT_FOUND',
    UNAUTHORIZED_ACCESS: 'CHAT_UNAUTHORIZED_ACCESS',
  },
  TAXONOMY: {
    INVALID_QUERY: 'TAXONOMY_INVALID_QUERY',
  },
} as const;
