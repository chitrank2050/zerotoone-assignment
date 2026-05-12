/**
 * ChatService - AI Orchestration Engine
 *
 * Powered by Groq (LLaMA 3.3 70B) for ultra-fast, free-tier inference.
 *
 * Logic Flow:
 *   1. Persistence: Save user intent to PostgreSQL.
 *   2. Contextualization: Fetch relevant taxonomies for RAG grounding.
 *   3. AI Inference: Stream response via Groq's OpenAI-compatible API.
 *   4. Signal Extraction: Parse structured JSON block from response.
 */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

import { ERRORS } from '@common/constants/error-messages';
import { SYSTEM_PROMPTS } from '@common/constants/prompts';
import {
  isForeignKeyError,
  isNotFoundError,
} from '@common/utils/prisma-errors';

import { PrismaService } from '@modules/prisma/prisma.service';
import type { Message } from '@prisma/client';
import { TaxonomyService } from '../taxonomy/taxonomy.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private client: Groq;
  private readonly modelName = 'llama-3.3-70b-versatile';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private taxonomyService: TaxonomyService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.client = new Groq({ apiKey: apiKey || '' });
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

    if (conversation.userId !== userId) {
      throw new NotFoundException(ERRORS.CHAT.CONVERSATION_NOT_FOUND);
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Builds the OpenAI-compatible message array with system prompt + history.
   */
  private async buildMessages(
    userId: string,
    conversationId: string,
    text: string,
  ): Promise<Groq.Chat.ChatCompletionMessageParam[]> {
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

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: Message) => ({
        role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
      { role: 'user', content: text },
    ];

    return messages;
  }

  /**
   * Non-streaming message send.
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

    const messages = await this.buildMessages(userId, conversationId, text);

    let responseText: string;
    try {
      const completion = await this.client.chat.completions.create({
        model: this.modelName,
        messages,
      });
      responseText = completion.choices[0]?.message?.content || '';
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Groq API Error: ${msg}`);
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

    const messages = await this.buildMessages(userId, conversationId, text);

    let fullResponse = '';
    try {
      const stream = await this.client.chat.completions.create({
        model: this.modelName,
        messages,
        stream: true,
        max_tokens: 2048,
      });

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || '';
        if (chunkText) {
          fullResponse += chunkText;
          yield { data: { chunk: chunkText } };
        }
      }

      // Persist full response
      await this.prisma.message.create({
        data: { conversationId, role: 'agent', content: fullResponse },
      });
      await this.updateConversationTimestamp(conversationId);

      // Extract structured signals from the JSON block in the response
      const signals = this.extractSignals(fullResponse);
      if (signals) {
        yield { data: { signals } };
      }

      yield { data: { done: true } };
    } catch (error: any) {
      const msg = error?.message || String(error);
      this.logger.error(`Groq Streaming Error: ${msg}`);

      let userError = 'Streaming failed. Please try again.';
      if (msg.includes('429') || msg.includes('rate_limit')) {
        userError = 'Rate limit reached. Please wait a moment and retry.';
      } else if (msg.includes('401') || msg.includes('auth')) {
        userError = 'Invalid API key. Please check your GROQ_API_KEY.';
      }

      yield { data: { error: userError } };
    }
  }

  /**
   * Parses the structured JSON signal block embedded in the AI response.
   */
  private extractSignals(text: string): any | null {
    try {
      const match = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (!match?.[1]) return null;

      const parsed = JSON.parse(match[1]);
      if (!parsed.signals || !Array.isArray(parsed.signals)) return null;

      parsed.signals = parsed.signals.map((s: any, idx: number) => ({
        id: s.id || `signal-${idx}`,
        type: s.type || 'interest',
        label: s.label || 'Unknown Signal',
        path: s.path || '',
        reach: s.reach || this.estimateReach(s.type),
      }));

      if (!parsed.totalReach) {
        const sum = parsed.signals.reduce(
          (acc: number, s: any) => acc + (s.reach || 0),
          0,
        );
        parsed.totalReach = Math.round(sum * 0.65);
      }

      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Fallback audience size estimates by signal type.
   */
  private estimateReach(type: string): number {
    const estimates: Record<string, number> = {
      location: 1_500_000,
      transaction: 800_000,
      demographic: 15_000_000,
      interest: 3_000_000,
    };
    return estimates[type] ?? 1_000_000;
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
