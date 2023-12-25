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
    // console.log('get connect', payload);
    await this.getOrAddWithcache(
      {
        guid: payload.guid,
        os_name: payload.os_name,
        name: payload.guid,
        desc: '',
      },
      'guid',
      payload.guid,
    );
  }
  @OnEvent(EventNameType.DebugServerClientResp)
  handleClientData(payload: ClientSocketItem, to_userid: number, msg: string) {
    this.chat_server.sendMessage(payload.guid, to_userid, SocketIoMessageType.Debug_cmd_req, msg);
  }

  async getAllConnected(): Promise<DebugClientEntity[]> {
    const guids = [];
    this.debug_server.clients.forEach((item) => {
      guids.push(item.guid);
    });
    if (guids.length <= 0) return [];
    const res = await this.DebugClientRepository.createQueryBuilder(this.table_name)
      .where(this.table_name + '.guid in (:ids)', { ids: guids })
      .getMany();
    return res;
  }

  async send_data_fix(datas: DebugClientEntity[]): Promise<void> {
    datas.forEach((item) => {
      const findinfo = this.debug_server.clients_byguid.get(item.guid);
      item.connected = findinfo != null;
      if (findinfo != null) {
        item.address = findinfo.ip;
      }
    });
  }
}
