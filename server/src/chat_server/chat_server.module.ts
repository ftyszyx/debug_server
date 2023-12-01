import { Module } from '@nestjs/common';
import { ChatServerGateWay } from './chat_server.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [ChatServerGateWay],
  imports: [AuthModule, AuthService],
})
export class ChatServerModule {}
