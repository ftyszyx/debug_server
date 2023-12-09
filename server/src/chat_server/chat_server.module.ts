import { Module } from '@nestjs/common';
import { ChatServerGateWay } from './chat_server.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ChatServerGateWay],
  imports: [AuthModule],
  exports: [ChatServerGateWay],
})
export class ChatServerModule {}
