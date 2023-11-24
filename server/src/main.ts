import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { AppHttpConfig } from './entity/other';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose'],
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
