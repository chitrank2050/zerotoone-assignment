import { ErrorKeys } from '@audience-builder/shared';

/**
 * Centralized error messages used across the application.
 *
 * Why centralize?
 *   - Frontend can match on error codes programmatically
 *   - Consistent wording across all modules
 *   - Easy to find and update all error messages in one place
 */
export const ERRORS = {
  /**
   * Authentication related error messages
   */
  AUTH: {
    USER_NOT_FOUND: ErrorKeys.AUTH.USER_NOT_FOUND,
    INVALID_CREDENTIALS: ErrorKeys.AUTH.INVALID_CREDENTIALS,
  },
  /**
   * Chat/Conversation related error messages
   */
  CHAT: {
    CONVERSATION_NOT_FOUND: ErrorKeys.CHAT.CONVERSATION_NOT_FOUND,
    UNAUTHORIZED_ACCESS: ErrorKeys.CHAT.UNAUTHORIZED_ACCESS,
  },
  /**
   * Taxonomy related error messages
   */
  TAXONOMY: {
    INVALID_QUERY: ErrorKeys.TAXONOMY.INVALID_QUERY,
  },
  /**
   * Generic database error messages
   */
  COMMON: {
    UNIQUE_CONSTRAINT: (field: string) =>
      `A record with this ${field} already exists`,
    RECORD_NOT_FOUND: 'The requested record could not be found',
  },
} as const;
