import { Body, Controller, Post } from '@nestjs/common';
import { ChatRoomService } from './chat_room.service';
import { PowerCode } from 'src/core/decorator/power.decorator';
import { ModuleType, PowerCodeType } from 'src/entity/constant';
import { GetChatRoomReq } from './chat_room.entity';
@Controller('chat_room')
export class ChatRoomController {
  constructor(private readonly room: ChatRoomService) {}

  @Post('getRoomById')
  @PowerCode({ module: ModuleType.ChatRoom, code: PowerCodeType.See })
  async getRoomById(@Body() req_parms: GetChatRoomReq) {
    return await this.room.findById(req_parms.room_id);
  }
}
