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
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  Content,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { TaxonomyService } from '../taxonomy/taxonomy.service';
import type {
  LocationTaxonomy,
  TransactionTaxonomy,
  Message,
} from '@prisma/client';

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
   * Hydrates the message history for a session.
   */
  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * The primary AI loop. Manages prompt engineering and context grounding.
   */
  async sendMessage(userId: string, conversationId: string, text: string) {
    await this.prisma.message.create({
      data: { conversationId, role: 'user', content: text },
    });

    const locations = await this.taxonomyService.getAllLocations();
    const transactions = await this.taxonomyService.getAllTransactions();

    const systemPrompt = `
      You are an AI Audience Builder assistant for an advertising platform.
      Your goal is to translate natural language descriptions of audiences into structured targeting signals.
      
      Available Location Taxonomy:
      ${JSON.stringify(locations.map((l: LocationTaxonomy) => ({ id: l.externalId, path: l.path })))}
      
      Available Transaction Taxonomy:
      ${JSON.stringify(transactions.map((t: TransactionTaxonomy) => ({ id: t.externalId, path: t.path })))}
      
      Goal:
      - Interpret the user's audience description.
      - Recommend the most relevant signals from the taxonomies above.
      - If the user provides demographic info (age, gender, income), map it to consumer group (CG) fields.
      - Once signals are approved, provide a "Reachable Audience Size" estimate.
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
      this.logger.error(`Gemini API Error: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to communicate with AI service',
      );
    }

    await this.prisma.message.create({
      data: { conversationId, role: 'agent', content: responseText },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return responseText;
  }
}
