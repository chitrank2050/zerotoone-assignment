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
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
  },
  /**
   * Chat/Conversation related error messages
   */
  CHAT: {
    CONVERSATION_NOT_FOUND: (id: string) =>
      `Conversation with ID "${id}" not found`,
    UNAUTHORIZED_ACCESS:
      'You do not have permission to access this conversation',
  },
  /**
   * Taxonomy related error messages
   */
  TAXONOMY: {
    INVALID_QUERY: 'Search query cannot be empty',
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
