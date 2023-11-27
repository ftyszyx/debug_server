import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Server as NetSocket, Socket } from 'net';
import * as net from 'net';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { DebugServerConfig } from 'src/entity/config';
const DATA_EVENT = 'data';
const ERROR_EVENT = 'error';
const CLOSE_EVENT = 'close';
const HEAD_SIZE = 12;
const LogTag = 'debugServer';
@Injectable()
export class DebugService {
  protected server: NetSocket;
  private isExplicitlyTerminated = false;
  private retryAttemptsCount = 0;
  //   private readonly socketClass: Type<TcpSocket>;
  private config: DebugServerConfig;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private config_all: ConfigService,
  ) {
    this.config = config_all.get<DebugServerConfig>('debug_server');
    this.init();
  }

  public bindHandler(socket: Socket) {
    socket.on(DATA_EVENT, async (msg: Buffer) => this.handlerMessage(socket, msg));
    socket.on(ERROR_EVENT, this.handleError.bind(this));
  }
  protected handleError(error: string) {
    this.logger.error(error);
  }

  public async handlerMessage(socket: Socket, msg: Buffer) {
    this.logger.log(`debugserver get data:${msg.byteLength}`, LogTag);
    const len = msg.byteLength;
    if (len <= HEAD_SIZE) return;
    const body = msg.buffer.slice(HEAD_SIZE, len);
    const text = Buffer.from(body).toString();
    this.logger.log(`get text:${text}`, LogTag);
  }
  public handleClose(): undefined | number | NodeJS.Timer {
    if (this.isExplicitlyTerminated || this.retryAttemptsCount >= this.config.retry) {
      this.logger.log('tcp server close', LogTag);
      return undefined;
    }
    ++this.retryAttemptsCount;
    return setTimeout(() => this.server.listen(this.config.port, this.config.port), this.config.retry_delay);
  }
  public close() {
    this.isExplicitlyTerminated = true;
    this.server.close();
  }

  public handleConnect(socket: Socket) {
    this.logger.log('connect');
  }

  private init() {
    this.server = net.createServer(this.bindHandler.bind(this));
    this.server.on(ERROR_EVENT, this.handleError.bind(this));
    this.server.on(CLOSE_EVENT, this.handleClose.bind(this));
    this.server.on('connection', this.handleConnect.bind(this));
    this.server.on('listening', () => {
      const address = this.server.address() as net.AddressInfo;
      this.logger.log(`debugsever listen:${address.address}:${address.port}`, LogTag);
    });
    this.server.listen(this.config.port, this.config.host);
  }
}
