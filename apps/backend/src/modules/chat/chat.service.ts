/**
 * ChatService - AI Orchestration Engine
 *
 * The core business logic for the Audience Builder. Manages the integration
 * with Google Gemini 2.5 Flash and orchestrates the taxonomy injection loop.
 *
 * Logic Flow:
 *   1. Persistence: Save user intent to LibSQL.
 *   2. Contextualization: Fetch latest taxonomies for prompt groundedness.
 *   3. AI Negotiation: Start/Resume Gemini chat session with system instructions.
 *   4. Result Mapping: Extract signals from AI response and update session metadata.
 *
 * Performance: Optimized for low-latency AI responses via Gemini 2.5 Flash.
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

import { GoogleGenAI } from '@google/genai';

import { PrismaService } from '@modules/prisma/prisma.service';

import type { Message } from '@prisma/client';

import { TaxonomyService } from '../taxonomy/taxonomy.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private client: GoogleGenAI;
  private readonly modelName = 'gemini-2.0-flash';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private taxonomyService: TaxonomyService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.client = new GoogleGenAI({
      apiKey: apiKey || '',
      apiVersion: 'v1',
    });
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
   * Prepares the Gemini chat contents with system prompts and history.
   */
  private async prepareContents(
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

    const contents: any[] = history.map((m: Message) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    if (contents.length === 1) {
      contents.unshift({ role: 'user', parts: [{ text: systemPrompt }] });
      contents.push({
        role: 'model',
        parts: [{ text: SYSTEM_PROMPTS.ACKNOWLEDGMENT }],
      });
    }

    // Add current message
    contents.push({ role: 'user', parts: [{ text }] });

    return contents;
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

    const contents = await this.prepareContents(userId, conversationId, text);

    let responseText: string;
    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents,
      });
      responseText = response.text || '';
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

    const contents = await this.prepareContents(userId, conversationId, text);

    let fullResponse = '';
    try {
      const stream = await this.client.models.generateContentStream({
        model: this.modelName,
        contents,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        fullResponse += chunkText;
        yield { data: { chunk: chunkText } };
      }

      // Persist full message and update timestamp
      await this.prisma.message.create({
        data: { conversationId, role: 'agent', content: fullResponse },
      });
      await this.updateConversationTimestamp(conversationId);

      yield { data: { done: true } };
    } catch (error: any) {
      const msg = error?.message || String(error);
      this.logger.error(`Gemini Streaming Error: ${msg}`);

      let userError = 'Streaming failed. Please try again.';
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        userError =
          'API quota exhausted. Please wait a minute or use a new API key.';
      } else if (msg.includes('503') || msg.includes('UNAVAILABLE')) {
        userError = 'Model temporarily unavailable. Please retry in a moment.';
      }

      yield { data: { error: userError } };
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
