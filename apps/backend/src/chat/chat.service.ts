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
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async createConversation(userId: string, title: string) {
    return this.prisma.conversation.create({
      data: { userId, title },
    });
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(userId: string, conversationId: string, text: string) {
    // 1. Save user message
    await this.prisma.message.create({
      data: { conversationId, role: 'user', content: text },
    });

    // 2. Fetch context (Taxonomies)
    const locations = await this.taxonomyService.getAllLocations();
    const transactions = await this.taxonomyService.getAllTransactions();

    // 3. Prompt Gemini
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
      - If the user provides demographic info (age, gender, income), map it to CG fields.
      - Once signals are approved, provide a "Reachable Audience Size" estimate.
      
      Constraint: Only use IDs from the provided taxonomies.
    `;

    // Fetch conversation history
    const history = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    const chatHistory: Content[] = history.map((m: Message) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Add system instruction at the beginning if history is empty
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

    const chat = this.model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(text);
    const responseText = result.response.text();

    // 4. Save agent response
    await this.prisma.message.create({
      data: { conversationId, role: 'agent', content: responseText },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return responseText;
  }
}
