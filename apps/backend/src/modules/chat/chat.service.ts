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
   * The primary AI loop. Manages prompt engineering and context grounding.
   */
  async sendMessage(userId: string, conversationId: string, text: string) {
    try {
      // Principal Grade Security: Ensure message is appended to OWN conversation
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

    // --- RAG: Dynamic Context Grounding ---
    // Instead of sending 5000+ signals, we perform a lightweight fuzzy match
    // to find the most relevant branches for the user's current request.
    const [relevantLocations, relevantTransactions] = await Promise.all([
      this.taxonomyService.searchLocations(text),
      this.taxonomyService.searchTransactions(text),
    ]);

    const systemPrompt = `
        You are an AI Audience Builder assistant for an advertising platform.
        Your goal is to translate natural language descriptions of audiences into structured targeting signals.

        I have retrieved the most relevant signals based on the user's query:

        Relevant Location Signals:
        ${JSON.stringify(relevantLocations.slice(0, 50).map((l) => ({ id: l.externalId, path: l.path })))}

        Relevant Transaction Signals:
        ${JSON.stringify(relevantTransactions.slice(0, 50).map((t) => ({ id: t.externalId, path: t.path })))}

        Instructions:
        - Interpret the user's intent and map it to the retrieved signals.
        - If the provided signals are insufficient, ask the user for more specifics.
        - Map demographics (age, gender, income) to standard consumer groups.
        - Provide a "Reachable Audience Size" estimate once signals are finalized.
      `;

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
        parts: [{ text: 'Understood. I will help you build your audience.' }],
      });
    }

    const chat = this.model.startChat({ history: chatHistory });

    let responseText: string;
    try {
      const result = await chat.sendMessage(text);
      responseText = result.response.text();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Gemini API Error: ${errorMessage}`, errorStack);
      throw new InternalServerErrorException(
        'Failed to communicate with AI service',
      );
    }

    await this.prisma.message.create({
      data: { conversationId, role: 'agent', content: responseText },
    });

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

    return responseText;
  }
}
