import { Body, Controller, Post } from '@nestjs/common';
import { ChatServerGateWay } from './chat_server.gateway';
import { PowerCode } from 'src/core/decorator/power.decorator';
import { ModuleType, PowerCodeType } from 'src/entity/constant';
import { ApiBody } from '@nestjs/swagger';
import { ListReq, ListReqSwagger } from 'src/entity/api.entity';
import { ChatLogEntity } from './chat_Log.entity';

@Controller('chat-server')
export class ChatServerController {
  constructor(private readonly chatService: ChatServerGateWay) {}

  @Post('getList')
  @PowerCode({ module: ModuleType.ChatLog, code: PowerCodeType.See })
  @ApiBody({ type: ListReqSwagger })
  async getList(@Body() req_parms: ListReq<ChatLogEntity>) {
    return await this.chatService.getList(req_parms);
  }
}
