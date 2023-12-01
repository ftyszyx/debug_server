import { Inject } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/user/user.entity';

const LogTagName = 'chatServer';
export class ChatServerClient {
  constructor(
    public user: UserEntity,
    public socket: Socket,
  ) {}
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatServerGateWay implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  public clients = new Map<number, ChatServerClient>();
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly myLogger: WinstonLogger,
    private auth: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.myLogger.log('socket.io init', LogTagName);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.auth.CheckToken(client.handshake.headers);
    this.clients.set(user.id, new ChatServerClient(user, client));
    client['user_id'] = user.id;
    this.myLogger.log(`chat user connect:${user.id}:${user.user_name}`, LogTagName);
  }

  handleDisconnect(client: Socket) {
    const user_id = client['user_id'];
    const client_info = this.clients.get(user_id);
    this.clients.delete(user_id);
    this.myLogger.log(`chat user disconnect:${client_info.user.id}:${client_info.user.user_name}`, LogTagName);
  }

  @SubscribeMessage('debug_cmd')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): WsResponse<unknown> {
    // this.myLogger.log('get data', data, LogTagName);
    // return data;
    return { event: 'chat', data };
  }
}
