import { Module } from '@nestjs/common';
import { ChatServerGateWay } from './chat_server.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLogEntity } from './chat_Log.entity';
import { ChatServerController } from './chat_server.controller';

@Module({
  providers: [ChatServerGateWay],
  imports: [AuthModule, TypeOrmModule.forFeature([ChatLogEntity])],
  exports: [ChatServerGateWay],
  controllers: [ChatServerController],
})
export class ChatServerModule {}
