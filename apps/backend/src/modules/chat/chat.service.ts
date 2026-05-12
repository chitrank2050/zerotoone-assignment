/**
 * ChatService - AI Orchestration Engine
 *
 * The core business logic for the Audience Builder. Manages the integration
 * with Google Gemini 1.5 Flash and orchestrates the taxonomy injection loop.
 *
 * Logic Flow:
 *   1. Persistence: Save user intent to LibSQL.
 *   2. Contextualization: Fetch latest taxonomies for prompt groundedness.
 *   3. AI Negotiation: Start/Resume Gemini chat session with system instructions.
 *   4. Result Mapping: Extract signals from AI response and update session metadata.
 *
 * Performance: Optimized for low-latency AI responses via Gemini 1.5 Flash.
 */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ERRORS } from '@common/constants/error-messages';
import { SYSTEM_PROMPTS } from '@common/constants/prompts';
import {
  isForeignKeyError,
  isNotFoundError,
} from '@common/utils/prisma-errors';

import {
  Content,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';

import { PrismaService } from '@modules/prisma/prisma.service';

import type { Message } from '@prisma/client';

import { TaxonomyService } from '../taxonomy/taxonomy.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private taxonomyService: TaxonomyService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Initializes a new Audience Building session.
   */
  async createConversation(userId: string, title: string) {
    return this.prisma.conversation.create({
      data: { userId, title },
    });
  }

  /**
   * Retrieves session history for a specific planner.
   */
  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Retrieves ALL session history globally (Admin only).
   */
  async getAllConversations() {
    return this.prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { user: true },
    });
  }

  /**
   * Hydrates the message history for a session.
   */
  async getMessages(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(ERRORS.CHAT.CONVERSATION_NOT_FOUND);
    }

    // Principal Grade Security: Verify ownership
    if (conversation.userId !== userId) {
      throw new NotFoundException(ERRORS.CHAT.CONVERSATION_NOT_FOUND);
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Prepares the Gemini chat session with system prompts and history.
   */
  private async prepareChat(
    userId: string,
    conversationId: string,
    text: string,
  ) {
    // --- RAG: Dynamic Context Grounding ---
    const [relevantLocations, relevantTransactions] = await Promise.all([
      this.taxonomyService.searchLocations(text),
      this.taxonomyService.searchTransactions(text),
    ]);

    const systemPrompt = SYSTEM_PROMPTS.AUDIENCE_BUILDER(
      JSON.stringify(
        relevantLocations
          .slice(0, 50)
          .map((l) => ({ id: l.externalId, path: l.path })),
      ),
      JSON.stringify(
        relevantTransactions
          .slice(0, 50)
          .map((t) => ({ id: t.externalId, path: t.path })),
      ),
    );

    const history = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    const chatHistory: Content[] = history.map((m: Message) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    if (chatHistory.length === 1) {
      chatHistory.unshift({ role: 'user', parts: [{ text: systemPrompt }] });
      chatHistory.push({
        role: 'model',
        parts: [{ text: SYSTEM_PROMPTS.ACKNOWLEDGMENT }],
      });
    }

    return this.model.startChat({ history: chatHistory });
  }

  /**
   * The primary AI loop. Manages prompt engineering and context grounding.
   */
  async sendMessage(userId: string, conversationId: string, text: string) {
    try {
      await this.prisma.conversation.findFirstOrThrow({
        where: { id: conversationId, userId },
      });

      await this.prisma.message.create({
        data: { conversationId, role: 'user', content: text },
      });
    } catch (error) {
      if (isForeignKeyError(error) || isNotFoundError(error)) {
        throw new NotFoundException(ERRORS.CHAT.CONVERSATION_NOT_FOUND);
      }
      throw error;
    }

    const chat = await this.prepareChat(userId, conversationId, text);

    let responseText: string;
    try {
      const result = await chat.sendMessage(text);
      responseText = result.response.text();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Gemini API Error: ${errorMessage}`);
      throw new InternalServerErrorException(
        'Failed to communicate with AI service',
      );
    }

    await this.prisma.message.create({
      data: { conversationId, role: 'agent', content: responseText },
    });

    await this.updateConversationTimestamp(conversationId);

    return responseText;
  }

  /**
   * Streams the AI response using SSE.
   */
  async *sendMessageStream(
    userId: string,
    conversationId: string,
    text: string,
  ) {
    try {
      await this.prisma.conversation.findFirstOrThrow({
        where: { id: conversationId, userId },
      });

      await this.prisma.message.create({
        data: { conversationId, role: 'user', content: text },
      });
    } catch {
      yield { data: { error: ERRORS.CHAT.CONVERSATION_NOT_FOUND } };
      return;
    }

    const chat = await this.prepareChat(userId, conversationId, text);

    let fullResponse = '';
    try {
      const result = await chat.sendMessageStream(text);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        yield { data: { chunk: chunkText } };
      }

      // Persist full message and update timestamp
      await this.prisma.message.create({
        data: { conversationId, role: 'agent', content: fullResponse },
      });
      await this.updateConversationTimestamp(conversationId);

      yield { data: { done: true } };
    } catch (error) {
      this.logger.error(`Gemini Streaming Error: ${error}`);
      yield { data: { error: 'Streaming failed' } };
    }
  }

  private async updateConversationTimestamp(conversationId: string) {
    try {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new NotFoundException(ERRORS.CHAT.CONVERSATION_NOT_FOUND);
      }
      throw error;
    }
  }
}
