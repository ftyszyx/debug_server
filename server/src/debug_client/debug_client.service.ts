import { HttpException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { WebClientReq } from 'src/entity/debug.entity';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { Repository } from 'typeorm';
import { DebugClientEntity } from './debug_client.entity';
import { RedisService } from 'src/db/redis/redis.service';
import { getDebugClientKey } from 'src/utils/redis';
import { EventNameType, Net_Retcode } from 'src/entity/constant';
import { ClientSocketItem, DebugServerService } from 'src/debug_server/debug_server.service';

@Injectable()
export class DebugClientService extends BaseCrudService<DebugClientEntity> {
  constructor(
    @InjectRepository(DebugClientEntity)
    private readonly DebugClientRepository: Repository<DebugClientEntity>,
    private redis: RedisService,
    private debug_server: DebugServerService,
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
    await this.debug_server.sendMsgTo(payload.client_guid, `${payload.cmd} ${payload.param}`);
  }

  @OnEvent(EventNameType.DebugServerClientConnect)
  async handleClientConnect(payload: ClientSocketItem) {
    await this.getOrCreateOne({ guid: payload.guid, system_type: payload.os, name: payload.guid });
  }

  async getOrCreateOne(info: Partial<DebugClientEntity>) {
    const key = getDebugClientKey(info.guid);
    const res = await this.redis.get<DebugClientEntity>(key);
    if (res != null) return res;
    const old_value = await this.DebugClientRepository.findOne({ where: { guid: info.guid } });
    if (old_value) {
      return old_value;
    }
    return await this.addOne(info);
  }
}
