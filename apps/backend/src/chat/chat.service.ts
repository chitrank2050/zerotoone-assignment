import { Injectable } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  Content,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { TaxonomyService } from '../taxonomy/taxonomy.service';
import { LocationTaxonomy, TransactionTaxonomy, Message } from '@prisma/client';

/**
 * ChatService handles the core AI orchestration for the Audience Builder.
 * It manages conversation persistence and integrates with Google Gemini (1.5 Flash)
 * to map natural language requirements to structured taxonomy signals.
 */
@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private taxonomyService: TaxonomyService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey || '');
    // Using gemini-1.5-flash for optimal latency vs accuracy balance in audience mapping
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Initializes a new conversation for a user.
   * @param userId Unique identifier of the planner/admin.
   * @param title User-defined title for the audience build.
   * @returns The created Conversation record.
   */
  async createConversation(userId: string, title: string) {
    return this.prisma.conversation.create({
      data: { userId, title },
    });
  }

  /**
   * Retrieves all conversations for a specific user, ordered by most recent.
   * @param userId Unique identifier of the planner.
   */
  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Fetches the message history for a specific conversation.
   * @param conversationId The ID of the audience building session.
   */
  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Orchestrates the AI response for a given user message.
   * This includes context injection (taxonomies), history management, and result persistence.
   *
   * @param userId The user sending the message.
   * @param conversationId The active session ID.
   * @param text The natural language audience description.
   * @returns The text response from the AI model.
   */
  async sendMessage(userId: string, conversationId: string, text: string) {
    // 1. Persist the user's input message
    await this.prisma.message.create({
      data: { conversationId, role: 'user', content: text },
    });

    // 2. Fetch the latest taxonomy context to ensure AI maps to valid signals
    const locations = await this.taxonomyService.getAllLocations();
    const transactions = await this.taxonomyService.getAllTransactions();

    // 3. Construct the dynamic system prompt with current taxonomy snapshots
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
      
      Constraint: Only use IDs from the provided taxonomies. If no direct match is found, suggest the closest parent.
    `;

    // 4. Resolve full conversation history for context-aware AI interactions
    const history = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    const chatHistory: Content[] = history.map((m: Message) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Inject system instructions as the foundational context if it's a new conversation
    if (chatHistory.length === 1) {
      chatHistory.unshift({
        role: 'user',
        parts: [{ text: systemPrompt }],
      });
      chatHistory.push({
        role: 'model',
        parts: [
          {
            text: 'Understood. I will help you build your audience using the provided taxonomies.',
          },
        ],
      });
    }

    // 5. Invoke Gemini Model
    const chat = this.model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(text);
    const responseText = result.response.text();

    // 6. Persist AI response
    await this.prisma.message.create({
      data: { conversationId, role: 'agent', content: responseText },
    });

    // 7. Update conversation metadata (timestamp) for UI ordering
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return responseText;
  }
}
