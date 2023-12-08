import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { WebClientReq } from 'src/entity/debug.entity';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { Repository } from 'typeorm';
import { DebugClientEntity } from './debug_client.entity';
import { RedisService } from 'src/db/redis/redis.service';
import { getDebugClientKey } from 'src/utils/redis';

@Injectable()
export class DebugClientService extends BaseCrudService<DebugClientEntity> {
  constructor(
    @InjectRepository(DebugClientEntity)
    private readonly DebugClientRepository: Repository<DebugClientEntity>,
    private redis: RedisService,
  ) {
    super();
    this.init(DebugClientRepository, DebugClientEntity);
  }

  @OnEvent('chat.debug_cmd')
  handleChatCmd(payload: WebClientReq) {
    console.log('get req', payload);
  }

  async getOrCreateOne(guid: string) {
    const key = getDebugClientKey(guid);
    const res = await this.redis.get<DebugClientEntity>(key);
    if (res != null) return res;
    const old_value = await this.DebugClientRepository.findOne({ where: { guid: guid } });
    if (old_value) {
      return old_value;
    }
    // await this.DebugClientRepository.insert();

    return res;
  }
}
