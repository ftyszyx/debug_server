import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ChatServerGateWay } from 'src/chat_server/chat_server.gateway';
import { ChatSocketException } from 'src/entity/config';
import { Logger } from 'winston';
//resolve err message

@Catch(ChatSocketException)
export class ChatSocketExcepionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private chatserver: ChatServerGateWay,
  ) {}
  catch(exception: ChatSocketException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    console.log('catch exception', ctx, exception);
    // this.logger.error(`get socket exception:${JSON.stringify(exception)}`);
    // const senddata: chatLogErr = { code = exception.err_code, msg: exception.message };
    // this.chatserver.sendSocketErr();
  }
}
