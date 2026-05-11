/**
 * ChatController - AI Audience Orchestration API
 *
 * Main interaction point for the frontend audience building chat.
 *
 * Endpoints:
 *   POST /chat/conversations           - Initialize a new audience build session
 *   GET  /chat/conversations           - List historical build sessions for the sidebar
 *   POST /chat/conversations/:id/msg   - Send description to Gemini and receive signals
 *   GET  /chat/conversations/:id/msg   - Hydrate chat thread on session switch
 *
 * Auth: Placeholder 'admin-user-id' used. In production, this maps to JWT sub.
 * Flow: Controller -> ChatService -> Gemini 1.5 Flash -> LibSQL (Prisma)
 */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiResponse } from '../common/responses/api-response';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  /**
   * Initializes a new Audience Building session.
   * Persistence: Creates a new entry in the 'Conversation' table.
   */
  @Post('conversations')
  async createConversation(@Body('title') title: string) {
    const userId = 'admin-user-id';
    const result = await this.chatService.createConversation(
      userId,
      title || 'New Build',
    );
    return ApiResponse.ok(result);
  }

  /**
   * Retrieves the current user's session history.
   * Usage: Populates the 'Recent Builds' navigation sidebar.
   */
  @Get('conversations')
  async getConversations() {
    const userId = 'admin-user-id';
    const result = await this.chatService.getConversations(userId);
    return ApiResponse.ok(result);
  }

  /**
   * Ingests a natural language audience description and returns AI-mapped signals.
   * Core Loop: Injects latest taxonomies into Gemini prompt context for grounded results.
   */
  @Post('conversations/:id/messages')
  async sendMessage(@Param('id') id: string, @Body('text') text: string) {
    const userId = 'admin-user-id';
    const result = await this.chatService.sendMessage(userId, id, text);
    return ApiResponse.ok(result);
  }

  /**
   * Hydrates the message thread for a selected session.
   * Performance: Ordered by createdAt ascending for immediate chat consistency.
   */
  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string) {
    const result = await this.chatService.getMessages(id);
    return ApiResponse.ok(result);
  }
}
