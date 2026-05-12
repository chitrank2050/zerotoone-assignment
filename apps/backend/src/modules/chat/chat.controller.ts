/**
 * ChatController - AI Audience Orchestration API
 *
 * Main interaction point for the frontend audience building chat.
 *
 * Endpoints:
 *   POST /chat/conversations           - Initialize a new audience build session
 *   GET  /chat/conversations           - List historical build sessions for the sidebar
 *   POST /chat/conversations/:id/msg   - Send description to LLm and receive signals
 *   GET  /chat/conversations/:id/msg   - Hydrate chat thread on session switch
 *
 * Auth: Placeholder 'admin-user-id' used. In production, this maps to JWT sub.
 * Flow: Controller -> ChatService -> LLM -> DB (Prisma)
 */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Sse,
  MessageEvent,
  UseGuards,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { ErrorResponseDto } from '@common/dto/error-response.dto';
import { RolesGuard } from '@common/guards/roles.guard';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import {
  ConversationResponseDto,
  MessageResponseDto,
} from './dto/chat-response.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  /**
   * Initializes a new Audience Building session.
   */
  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initialize a new audience build session' })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
    type: ConversationResponseDto,
  })
  async createConversation(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateConversationDto,
  ) {
    const activeUserId = userId || 'admin-user-id';
    return this.chatService.createConversation(
      activeUserId,
      dto.title || 'New Build',
    );
  }

  /**
   * Retrieves the current user's session history.
   * Permissions: Planner (Self-only)
   */
  @Get('conversations')
  @ApiOperation({ summary: 'List your own build sessions' })
  @ApiResponse({
    status: 200,
    description: 'List of sessions retrieved',
    type: [ConversationResponseDto],
  })
  async getConversations(@CurrentUser('id') userId: string) {
    const activeUserId = userId || 'admin-user-id';
    return this.chatService.getConversations(activeUserId);
  }

  /**
   * Admin-only: Retrieves global session history.
   * Permissions: Admin (Global)
   */
  @Get('admin/conversations')
  @Roles('admin')
  @ApiOperation({ summary: 'ADMIN: List ALL build sessions globally' })
  @ApiResponse({
    status: 200,
    description: 'Global list of sessions retrieved',
    type: [ConversationResponseDto],
  })
  async getAllConversations() {
    // Principal Grade Logic: Admins bypass the userId filter
    return this.chatService.getAllConversations();
  }

  /**
   * Ingests natural language and returns AI-mapped signals.
   */
  @Post('conversations/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send audience description to AI engine' })
  @ApiResponse({
    status: 201,
    description: 'Message processed and AI response generated',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Gemini API failure or internal error',
    type: ErrorResponseDto,
  })
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    const activeUserId = userId || 'admin-user-id';
    return this.chatService.sendMessage(activeUserId, id, dto.content);
  }

  /**
   * Hydrates the message thread for a selected session.
   */
  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Retrieve full chat history for a session' })
  @ApiResponse({
    status: 200,
    description: 'Chat messages retrieved',
    type: [MessageResponseDto],
  })
  async getMessages(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const activeUserId = userId || 'admin-user-id';
    return this.chatService.getMessages(activeUserId, id);
  }

  /**
   * Streams audience description to AI engine using SSE.
   */
  @Sse('conversations/:id/stream')
  @ApiOperation({ summary: 'Stream audience description to AI engine (SSE)' })
  streamSendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Query('content') content: string,
  ): Observable<MessageEvent> {
    const activeUserId = userId || 'admin-user-id';
    return from(
      this.chatService.sendMessageStream(activeUserId, id, content),
    ).pipe(map((event) => event as MessageEvent));
  }
}
