import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat_room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from './chat_room.entity';
import { ChatRoomController } from './chat_room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoomEntity])],
  providers: [ChatRoomService],
  controllers: [ChatRoomController],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
