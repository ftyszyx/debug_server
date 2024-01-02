import { Body, Controller, Post, Req } from '@nestjs/common';
import { ChatServerGateWay } from './chat_server.gateway';
import { PowerCode } from 'src/core/decorator/power.decorator';
import { ModuleType, PowerCodeType } from 'src/entity/constant';
import { ApiBody } from '@nestjs/swagger';
import { ListReq, ListReqSwagger } from 'src/entity/api.entity';
import { ChatLogEntity } from './chat_Log.entity';
import { Request } from 'express';
@Controller('chat_server')
export class ChatServerController {
  constructor(private readonly chatService: ChatServerGateWay) {}

  @Post('getList')
  @PowerCode({ module: ModuleType.ChatLog, code: PowerCodeType.See })
  @ApiBody({ type: ListReqSwagger })
  async getList(@Body() req_parms: ListReq<ChatLogEntity>) {
    return await this.chatService.getList(req_parms);
  }

  @Post('getChatLogMore')
  @PowerCode({ module: ModuleType.ChatLog, code: PowerCodeType.See })
  //   @ApiBody({ type: ChatLogMoreReq })
  async getChatLogMore(@Req() req: Request) {
    return await this.chatService.getChatLogMore(req.body);
  }
}
