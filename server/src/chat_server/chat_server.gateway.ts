import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
import { WebClientReq } from 'src/entity/debug.entity';
import { UserEntity } from 'src/user/user.entity';
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
export class ChatServerGateWay implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  public clients = new Map<number, ChatServerClient>();
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly myLogger: WinstonLogger,
    private auth: AuthService,
    private event: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.myLogger.log('socket.io init', LogTagName);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.auth.CheckToken(client.handshake.headers);
    this.clients.set(user.id, new ChatServerClient(user, client));
    client[UserIdKey] = user.id;
    this.myLogger.log(`chat user connect:${user.id}:${user.user_name}`, LogTagName);
  }

  handleDisconnect(client: Socket) {
    const user_id = client[UserIdKey];
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

  async sendMessage(userid: number, event_name: string, data: any) {
    const client = this.clients.get(userid);
    if (!client) {
      this.myLogger.log(`client is not found:${userid}`, LogTagName);
      return;
    }
    if (client.isActive() == false) {
      this.myLogger.log(`client is offline:${userid}`, LogTagName);
      return;
    }
    client.socket.emit(event_name, data);
  }
  async sendDebugResp(userid: number, data: string) {
    await this.sendMessage(userid, 'debug_cmd', data);
  }

  @SubscribeMessage(SocketIoMessageType.Debug_cmd_req)
  handleDebugMsg(@MessageBody() data: WebClientReq, @ConnectedSocket() socket: Socket): Observable<WsResponse<unknown>> {
    data.from_user_id = socket[UserIdKey];
    this.myLogger.log(`get debugcmd data:${data}`, LogTagName);
    this.event.emit(EventNameType.ChatCmdEvnet, data);
    return;
  }
}
