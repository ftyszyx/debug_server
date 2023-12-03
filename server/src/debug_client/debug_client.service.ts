import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebClientReq } from 'src/entity/debug.entity';

@Injectable()
export class DebugClientService {
  constructor() {}

  @OnEvent('chat.debug_cmd')
  handleChatCmd(payload: WebClientReq) {
    console.log('get req', payload);
  }
}
