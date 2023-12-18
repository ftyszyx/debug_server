import { HttpException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { WebClientReq } from 'src/entity/debug.entity';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { Repository } from 'typeorm';
import { DebugClientEntity } from './debug_client.entity';
import { RedisService } from 'src/db/redis/redis.service';
import { getDebugClientKey } from 'src/utils/redis';
import { EventNameType, Net_Retcode, SocketIoMessageType } from 'src/entity/constant';
import { ClientSocketItem, DebugServerService } from 'src/debug_server/debug_server.service';
import { ChatServerGateWay } from 'src/chat_server/chat_server.gateway';

@Injectable()
export class DebugClientService extends BaseCrudService<DebugClientEntity> {
  constructor(
    @InjectRepository(DebugClientEntity)
    private readonly DebugClientRepository: Repository<DebugClientEntity>,
    private redis: RedisService,
    private debug_server: DebugServerService,
    private chat_server: ChatServerGateWay,
  ) {
    super();
    this.init(DebugClientRepository, DebugClientEntity);
  }

  @OnEvent(EventNameType.ChatCmdEvnet)
  async handleChatCmd(payload: WebClientReq) {
    console.log('get req', payload);
    const key = getDebugClientKey(payload.client_guid);
    const res = await this.redis.get<DebugClientEntity>(key);
    if (res == null) throw new HttpException(`${payload.client_guid}不连接`, Net_Retcode.ERR);
    this.debug_server.sendMsgTo(payload.from_user_id, payload.client_guid, `${payload.cmd} ${payload.param}`);
  }

  @OnEvent(EventNameType.DebugServerClientConnect)
  async handleClientConnect(payload: ClientSocketItem) {
    await this.getOrAddWithcache({ guid: payload.guid, system_type: payload.os, name: payload.guid }, 'guic', payload.guid);
  }
  @OnEvent(EventNameType.DebugServerClientResp)
  handleClientData(payload: ClientSocketItem, to_userid: number, msg: string) {
    this.chat_server.sendMessage(to_userid, SocketIoMessageType.Debug_cmd_req, msg);
  }
}
