import { Module } from '@nestjs/common';
import { ChatServerGateWay } from './chat_server.gateway';

@Module({
  providers: [ChatServerGateWay],
})
export class ChatServerModule {}
