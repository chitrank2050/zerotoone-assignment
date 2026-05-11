import { Module } from '@nestjs/common';

import { PrismaModule } from '@modules/prisma/prisma.module';

import { TaxonomyModule } from '../taxonomy/taxonomy.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [PrismaModule, TaxonomyModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
