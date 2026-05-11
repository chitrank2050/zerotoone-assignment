import { Controller, Post, Get, Body, Param, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiResponse } from '../common/responses/api-response';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('conversations')
  async createConversation(@Body('title') title: string) {
    // In a real app, userId would come from JWT (req.user.id)
    // For this task, we'll use a placeholder or handle auth later
    const userId = 'admin-user-id';
    const result = await this.chatService.createConversation(
      userId,
      title || 'New Build',
    );
    return ApiResponse.ok(result);
  }

  @Get('conversations')
  async getConversations() {
    const userId = 'admin-user-id';
    const result = await this.chatService.getConversations(userId);
    return ApiResponse.ok(result);
  }

  @Post('conversations/:id/messages')
  async sendMessage(@Param('id') id: string, @Body('text') text: string) {
    const userId = 'admin-user-id';
    const result = await this.chatService.sendMessage(userId, id, text);
    return ApiResponse.ok(result);
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string) {
    const result = await this.chatService.getMessages(id);
    return ApiResponse.ok(result);
  }
}
