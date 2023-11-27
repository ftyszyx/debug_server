import { Inject } from '@nestjs/common';
import {
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

const LogTagName = 'chat';
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatServerGateWay implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly myLogger: WinstonLogger) {}
  handleDisconnect(client: Socket) {
    this.myLogger.log(`disconnect:${client.id}`, LogTagName);
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    this.myLogger.log(`connect:${client.id}`);
  }

  afterInit(server: any) {
    this.myLogger.log('socket.io init', LogTagName);
  }

  @SubscribeMessage('chat')
  handleMessage(@MessageBody() data: any): WsResponse<unknown> {
    // this.myLogger.log('get data', data, LogTagName);
    // return data;
    return { event: 'chat', data };
  }
}
