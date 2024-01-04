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
import { ChatLogEntity, ChatLogMoreReq, ChatLogMoreResp } from './chat_Log.entity';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { JoinRoomReq } from 'src/entity/api.entity';
import { ChatRoomService } from 'src/chat_room/chat_room.service';
import { cli } from 'winston/lib/winston/config';
export const HEART_BEAT_INTERVAL = 3000;
const LogTagName = 'chatServer';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class ChatServerGateWay
  extends BaseCrudService<ChatLogEntity>
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly myLogger: WinstonLogger,
    private auth: AuthService,
    @InjectRepository(ChatLogEntity)
    private readonly chat_log: Repository<ChatLogEntity>,
    private chat_room: ChatRoomService,
    private event: EventEmitter2,
  ) {
    super();
    this.init(chat_log, ChatLogEntity);
  }

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.myLogger.log('socket.io init', LogTagName);
    this.server = server;
  }

  async handleConnection(client: Socket) {
    let userInfo: UserEntity = null;
    try {
      const token = client.handshake.auth.token;
      userInfo = await this.auth.CheckToken(token);
    } catch (err) {
      this.myLogger.error(`connect err ${err}`);
    }
    if (userInfo == null) {
      client.disconnect(true);
      return;
    }
    client['user'] = userInfo;
    this.myLogger.log(`chat user connect:${userInfo.id}:${userInfo.user_name}`, LogTagName);
  }

  handleDisconnect(client: Socket) {
    this.myLogger.log(`chat user disconnect:${client.id}`, LogTagName);
  }

  getUserBase(client: Socket) {
    const user = client['user'];
    if (user) return user as UserEntity;
    return null;
  }
  @SubscribeMessage(SocketIoMessageType.Join_room)
  async handleJoin(client: Socket, req: JoinRoomReq) {
    this.myLogger.log(`join room req1: ${JSON.stringify(req)}`, LogTagName);
    const user = this.getUserBase(client);
    if (user == null) return;
    const room_name = `${user.id}-${req.guid}`;
    this.myLogger.log(`join room req: ${JSON.stringify(req)}`, LogTagName);
    const res = await this.chat_room.AddOneRoom(room_name, req.nick, [user.id.toString(), req.guid]);
    client.join(res.id.toString());
    client.emit(SocketIoMessageType.Join_room_resp, res);
  }

  @SubscribeMessage(SocketIoMessageType.leave_room)
  handleLeave(client: Socket, roomId: string) {
    this.myLogger.log(`leave room req: ${roomId}`, LogTagName);
    client.leave(roomId.toString());
    return roomId;
  }

  async sendMessageToClient(guid: string, room_id: number, data: string) {
    const send_data: WebClientResp = { room_id, from_guid: guid, text: data };
    this.myLogger.log(`send debugcmd resp:${JSON.stringify(send_data)}`, LogTagName);
    this.server.to(room_id.toString()).emit(SocketIoMessageType.Debug_cmd_rep, send_data);
    await this.AddChatLog(guid, room_id, data);
  }

  @SubscribeMessage(SocketIoMessageType.Debug_cmd_req)
  async handleDebugMsg(
    @MessageBody() data: WebClientReq,
    @ConnectedSocket() socket: Socket,
  ): Promise<Observable<WsResponse<unknown>>> {
    const user = this.getUserBase(socket);
    if (user == null) return;
    this.myLogger.log(`get debugcmd req:${JSON.stringify(data)}`, LogTagName);
    this.event.emit(EventNameType.WebCmdReqEvent, data);
    await this.AddChatLog(user.id.toString(), data.room_id, `cmd:${data.cmd} ${data.param}`);
    return;
  }

  async AddChatLog(from: string, roomid: number, text: string) {
    const newlog = this.chat_log.create();
    newlog.from_user = from;
    newlog.room_id = roomid;
    newlog.text = text;
    await this.chat_log.save(newlog);
  }

  async getChatLogMore(req: ChatLogMoreReq) {
    const qb = await this.chat_log.createQueryBuilder(this.table_name);
    const res: ChatLogMoreResp = { logs: [], total: 0 };
    res.total = await qb.getCount();
    qb.where('chat_log.room_id= :id1', { id1: req.room_id });
    if (req.start_time != '') {
      qb.andWhere('chat_log.create_time >:time', { time: req.start_time });
    }
    if (req.end_time != '') {
      qb.andWhere('chat_log.create_time <:time', { time: req.end_time });
    }
    qb.orderBy('chat_log.create_time', 'DESC');
    qb.limit(req.num);
    res.logs = await qb.getMany();
    return res;
  }
}
