import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { AppHttpConfig } from './entity/config';
import { Request } from 'express';
// const allowlist = ['http://localhost:7000'];
const allowlist = [];
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose'],
  });
  app.enableCors((req: Request, callback) => {
    let corsOptions;
    // console.log("req.header('Origin') 1", req.header('Origin')); //如果你不需要 Cookie 可以设置为 *
    if (allowlist.length == 0 || allowlist.indexOf(req.header('Origin')) !== -1) {
      // console.log("req.header('Origin')", req.header('Origin')); //如果你不需要 Cookie 可以设置为 *
      // credentials 与前端的axios 的withCredentials（XMLHttpRequest.withCredentials）
      // 同时 origin必须设置为访问域 才能正常访问，主要是为了 凭证是 Cookie ，授权标头或 TLS 客户端证书
      corsOptions = { origin: req.header('Origin'), credentials: true };
    } else {
      corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('crash admin')
    .setDescription('crash admin api')
    .addBearerAuth()
    .setVersion('1.0')
    .addTag('user')
    .build();

  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { swaggerOptions: { tagsSorter: 'alpha', operationsSorter: 'alpha' } });
  const config_service = app.get(ConfigService);
  const http_config = config_service.get<AppHttpConfig>('http');
  await app.listen(http_config.port);
}
bootstrap();
