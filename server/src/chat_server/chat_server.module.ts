import { Module } from '@nestjs/common';
import { ChatServerGateWay } from './chat_server.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLogEntity } from './chat_Log.entity';
import { ChatServerController } from './chat_server.controller';
import { ChatRoomModule } from 'src/chat_room/chat_room.module';

@Module({
  providers: [ChatServerGateWay],
  imports: [AuthModule, TypeOrmModule.forFeature([ChatLogEntity]), ChatRoomModule],
  exports: [ChatServerGateWay],
  controllers: [ChatServerController],
})
export class ChatServerModule {}
