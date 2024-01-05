import { Injectable } from '@nestjs/common';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { ChatRoomEntity } from './chat_room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/db/redis/redis.service';
@Injectable()
export class ChatRoomService extends BaseCrudService<ChatRoomEntity> {
  constructor(
    private readonly redis: RedisService,
    @InjectRepository(ChatRoomEntity)
    protected readonly chatroom: Repository<ChatRoomEntity>,
  ) {
    super();
    this.init(chatroom, ChatRoomEntity);
  }

  async getOneByRoomKey(name: string) {
    return await this.getOneWithCache('name', name);
  }

  async AddOneRoom(name: string, nick: string, userlist: string[]) {
    const oldroom = await this.getOneByRoomKey(name);
    if (oldroom == null) {
      return await this.addOne({ users: userlist, name, nick });
    } else {
      if (oldroom.nick != nick) {
        return await this.updateById(oldroom.id, { nick });
      }
      return oldroom;
    }
  }
}
