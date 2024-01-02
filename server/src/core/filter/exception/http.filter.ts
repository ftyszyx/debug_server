import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiResp } from 'src/entity/api.entity';
import { Net_Retcode } from 'src/entity/constant';
import { getInfoFromReq } from 'src/utils/getInfoFromReq';
import { Logger } from 'winston';
//resolve err message

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
    let message = exception.message;
    const exception_resp: any = exception.getResponse();
    if (typeof exception_resp === 'object') {
      if (typeof exception_resp.message === 'string') {
        message = exception_resp.message;
      } else {
        message = exception_resp.message[0];
      }
    }
    const errorResponse: ApiResp<undefined> = {
      message: message,
      code: status,
    };
    this.logger.error(message, { req: getInfoFromReq(ctx.getRequest()) });
    response.status(Net_Retcode.SUCCESS);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
