import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'dgram';

@WebSocketGateway(4000, { namespace: 'events' })
export class EventsGateway {
  @SubscribeMessage('events')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    console.log('get data', data);
    return 'hello world';
  }
}
