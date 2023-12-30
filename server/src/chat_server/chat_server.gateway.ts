import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { EventNameType, SocketIoMessageType } from 'src/entity/constant';
import { WebClientReq, WebClientResp } from 'src/entity/debug.entity';
import { UserEntity } from 'src/user/user.entity';
import { ChatLogEntity } from './chat_Log.entity';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { ChatLogMoreReq, ChatLogMoreResp } from 'src/entity/api.entity';
export const HEART_BEAT_INTERVAL = 3000;
const LogTagName = 'chatServer';
const UserIdKey = 'user_id';

export class ChatServerClient {
  public lastActiveTime: number;
  constructor(
    public user: UserEntity,
    public socket: Socket,
  ) {}
  isActive(): boolean {
    return Date.now() - this.lastActiveTime < HEART_BEAT_INTERVAL * 2;
  }
}

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class ChatServerGateWay
  extends BaseCrudService<ChatLogEntity>
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  public clients = new Map<number, ChatServerClient>();
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly myLogger: WinstonLogger,
    private auth: AuthService,
    @InjectRepository(ChatLogEntity)
    private readonly chat_log: Repository<ChatLogEntity>,
    private event: EventEmitter2,
  ) {
    super();
    this.init(chat_log, ChatLogEntity);
  }

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.myLogger.log('socket.io init', LogTagName);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log('handle connect ', client.handshake);
    let userInfo: UserEntity = null;
    try {
      const token = client.handshake.auth.token;
      userInfo = await this.auth.CheckToken(token);
    } catch (err) {
      this.myLogger.error(`connect err ${err}`);
    }
    if (userInfo == null) {
      client.disconnect(true);
    }
    this.clients.set(userInfo.id, new ChatServerClient(userInfo, client));
    client[UserIdKey] = userInfo.id;
    this.myLogger.log(`chat user connect:${userInfo.id}:${userInfo.user_name}`, LogTagName);
  }

  handleDisconnect(client: Socket) {
    const user_id = client[UserIdKey];
    if (user_id == null) return;
    const client_info = this.clients.get(user_id);
    this.clients.delete(user_id);
    this.myLogger.log(`chat user disconnect:${client_info.user.id}:${client_info.user.user_name}`, LogTagName);
  }

  @SubscribeMessage('heartbeat')
  heartbeat(@ConnectedSocket() client: Socket): WsResponse<unknown> {
    const user_id = client[UserIdKey];
    const client_info = this.clients.get(user_id);
    this.myLogger.log(`heartbeat:${user_id}`, LogTagName);
    client_info.lastActiveTime = Date.now();
    return { event: 'heartbeat', data: 'ok' };
  }

  async sendMessage(from: string, userid: number, event_name: string, data: string) {
    const client = this.clients.get(userid);
    if (!client) {
      this.myLogger.log(`client is not found:${userid}`, LogTagName);
      return;
    }
    if (client.isActive() == false) {
      this.myLogger.log(`client is offline:${userid}`, LogTagName);
      return;
    }
    const send_data: WebClientResp = { from_guid: from, to_user_id: userid, text: data };
    client.socket.emit(event_name, send_data);
    const newlog = this.chat_log.create();
    newlog.from_user = from;
    newlog.to_users = [];
    newlog.to_user = userid.toString();
    newlog.text = `${data}`;
    await this.chat_log.save(newlog);
  }
  async sendDebugResp(from: string, userid: number, data: string) {
    await this.sendMessage(from, userid, SocketIoMessageType.Debug_cmd_rep, data);
  }

  @SubscribeMessage(SocketIoMessageType.Debug_cmd_req)
  async handleDebugMsg(
    @MessageBody() data: WebClientReq,
    @ConnectedSocket() socket: Socket,
  ): Promise<Observable<WsResponse<unknown>>> {
    this.myLogger.log(`get debugcmd data:${JSON.stringify(data)}`, LogTagName);
    this.event.emit(EventNameType.WebCmdReqEvent, data);
    const newlog = this.chat_log.create();
    newlog.from_user = data.from_user_id.toString();
    newlog.to_users = [];
    newlog.to_user = data.client_guid;
    newlog.text = `cmd:${data.cmd} ${data.param}`;
    await this.chat_log.save(newlog);
    return;
  }

  async getChatLogMore(req: ChatLogMoreReq, user: UserEntity) {
    let qb = await this.chat_log.createQueryBuilder(this.table_name);
    const res: ChatLogMoreResp = { logs: [], total: 0 };
    res.total = await qb.getCount();
    qb.where('chat_log.from_user= :id1', { id1: user.id.toString() }).andWhere('chat_log.to_user=:id2', { id2: req.guid });
    if (req.start_time != '') {
      qb.andWhere('chat_log.create_time >:time', { time: req.start_time });
    }
    if (req.end_time != '') {
      qb.andWhere('chat_log.create_time <:time', { time: req.end_time });
    }
    qb.orderBy('chat_log.create_time', 'DESC');
    qb.limit(req.num);
    res.logs = await qb.getMany();

    const remain_num = req.num - res.logs.length;
    if (remain_num > 0) {
      qb = await this.chat_log.createQueryBuilder(this.table_name);
      qb.where('chat_log.to_user= :id1', { id1: user.id.toString() }).andWhere('chat_log.from_user=:id2', { id2: req.guid });
      if (req.start_time != '') {
        qb.andWhere('chat_log.create_time >:time', { time: req.start_time });
      }
      if (req.end_time != '') {
        qb.andWhere('chat_log.create_time <:time', { time: req.end_time });
      }
      qb.orderBy('chat_log.create_time', 'DESC');
      qb.limit(remain_num);
      const res2 = await qb.getMany();
      res2.forEach((item) => {
        res.logs.push(item);
      });
    }
    return res;
  }
}
