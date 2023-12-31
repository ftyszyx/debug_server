import { ConsoleLogger, Inject, Injectable, LoggerService } from '@nestjs/common';
import { Server as NetSocket, Socket } from 'net';
import * as net from 'net';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { DebugServerConfig } from 'src/entity/config';
import { ClientCmdType } from 'src/entity/debug.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DebugClientEntity } from 'src/debug_client/debug_client.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNameType } from 'src/entity/constant';
import { from } from 'rxjs';
const HEAD_SIZE = 12;
const CLIENT_TIME_OUT = 30;
const LogTag = 'debugServer';
export class ClientSocketItem {
  onMessage: (cmd: string, msg: string) => Promise<void>;
  SendMessge: (msg: string) => void;
  ip: string = '';
  os_name: string = '';
  guid: string = '';
  protocol_address: number = 0;
  lastActiveTime: number = 0;
  constructor(public socket: Socket) {}
}

@Injectable()
export class DebugServerService {
  protected server: NetSocket;
  private isExplicitlyTerminated = false;
  private retryAttemptsCount = 0;
  private config: DebugServerConfig;
  private connect_id = 1;
  public clients = new Map<number, ClientSocketItem>();
  public clients_byguid = new Map<string, ClientSocketItem>();
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @InjectRepository(DebugClientEntity) private readonly debugClientsRepository: Repository<DebugClientEntity>,
    private config_all: ConfigService,
    private event: EventEmitter2,
  ) {
    this.config = config_all.get<DebugServerConfig>('debug_server');
    this.init();
  }

  public close() {
    this.isExplicitlyTerminated = true;
    this.server.close();
  }

  async sendMsgTo(from_user_id: number, guid: string, msg: string) {
    const client = this.clients_byguid.get(guid);
    if (client == null) return;
    const text_arr = Buffer.from(msg, 'utf-8');
    const total_len = HEAD_SIZE + text_arr.length;
    const send_buffer = Buffer.alloc(total_len);
    send_buffer.writeInt32LE(total_len, 0);
    send_buffer.writeInt32LE(from_user_id, 4);
    send_buffer.writeInt32LE(client.protocol_address, 8);
    send_buffer.write(msg, HEAD_SIZE, 'utf-8');
    console.log('send mes', msg, from_user_id, client.protocol_address, total_len, send_buffer.buffer);
    client.socket.write(send_buffer, (err) => {
      console.log('send data err', err);
    });
  }

  bindHandler(socket: Socket) {
    const id = socket['id'];
    this.logger.log(`client bind ip:${JSON.stringify(socket.address())} id:${id}`, LogTag);
    socket.on('data', async (msg: Buffer) => this.handleClientMessage(socket, msg));
    socket.on('error', (err) => {
      const id = socket['id'];
      console.log('socket err', err);
      this.logger.error(`sock:${id} err:${err.message}`);
    });
    socket.on('close', (has_err) => {
      const id = socket['id'];
      const clientinfo = this.clients.get(id);
      if (clientinfo == null) {
        return;
      }
      this.logger.error(`sock:${id} closed err:${has_err}`);
      this.connect_id--;
      this.clients.delete(id);
      this.clients_byguid.delete(clientinfo.guid);
    });
    socket.on('timeout', () => {
      console.log('socket timeout');
    });
    socket.on('end', () => {
      console.log('socket end');
    });
  }

  async handleClientMessage(socket: Socket, msg: Buffer) {
    const id = socket['id'];
    // this.logger.log(`debugserver get id:${id} data:${msg.byteLength}`, LogTag);
    const len = msg.byteLength;
    const package_len = msg.readInt32LE();
    const package_from = msg.readInt32LE(4);
    const to_userid = msg.readInt32LE(8);
    const client = this.clients.get(id);
    client.lastActiveTime = Date.now();
    if (len <= HEAD_SIZE) return;
    const body = msg.buffer.slice(HEAD_SIZE, len);
    const text = Buffer.from(body).toString();
    this.logger.log(`len:${package_len} from:${package_from} to:${to_userid} text:${text}`, LogTag);
    const cmd_end = text.indexOf(' ');
    client.protocol_address = package_from;
    if (cmd_end > 0) {
      const cmdtext = text.slice(0, cmd_end).trim();
      const parmas = text.slice(cmd_end).trim();
      this.logger.log(`cmd:${cmdtext} parmas:${parmas}`);
      if (cmdtext == ClientCmdType.SET) {
        const setarr = parmas.split(' ');
        for (let i = 0; i < setarr.length; i++) {
          const setitem_arr = setarr[i].trim().split('=');
          const set_name = setitem_arr[0].trim();
          const set_value = setitem_arr[1].trim();
          client[set_name] = set_value;
        }
        if (this.clients_byguid.has(client.guid) == false) {
          this.clients_byguid.set(client.guid, client);
        }
        this.event.emit(EventNameType.DebugServerClientConnect, client);
        return;
      }
      // client.onMessage(ClientCmdType.SET, parmas);
      return;
    }
    this.event.emit(EventNameType.DebugServerClientResp, client, to_userid, text);
  }

  handleClose(): undefined | number | NodeJS.Timer {
    this.connect_id = 0;
    this.clients.clear();
    this.clients_byguid.clear();
    if (this.isExplicitlyTerminated || this.retryAttemptsCount >= this.config.retry) {
      this.logger.log('tcp server close', LogTag);
      return undefined;
    }
    ++this.retryAttemptsCount;
    return setTimeout(() => this.server.listen(this.config.port, this.config.port), this.config.retry_delay);
  }

  handleConnect(socket: Socket) {
    const new_socketid = this.connect_id++;
    socket['id'] = new_socketid;
    this.logger.log(`client connect id:${new_socketid} ip:${JSON.stringify(socket.address())}`, LogTag);
    this.clients.set(new_socketid, new ClientSocketItem(socket));
  }

  init() {
    this.server = net.createServer(this.bindHandler.bind(this));
    this.server.on('error', (err) => {
      this.logger.error(`tcp server err ${err.message}`);
    });
    this.server.on('close', this.handleClose.bind(this));
    this.server.on('connection', this.handleConnect.bind(this));
    this.server.on('listening', () => {
      const address = this.server.address() as net.AddressInfo;
      this.logger.log(`debugsever listen:${address.address}:${address.port}`, LogTag);
    });
    this.server.listen(this.config.port, this.config.host);
  }
}
