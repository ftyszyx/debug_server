import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PowerModule } from './power/power.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { UserEntity } from './user/user.entity';
import { PowerEntity } from './power/power.entity';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LoggerMiddleware } from './core/middleware/logger/logger.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { LoadAppConfig } from './utils/load_config';
import { AppDbConfig } from './entity/other';
import { JwtAuthGuard } from './core/guard/jwt-auth.guard';
import { RedisModule } from './db/redis/redis.module';
import { RoleEntity } from './role/role.entity';
import { MenuEntity } from './menu/menu.entity';
import { RolesGuard } from './core/guard/roles.guard';
import { TypeormLogModule } from './typeorm_log/typeorm_log.module';
import { TypeormLogService } from './typeorm_log/typeorm_log.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [LoadAppConfig],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('admin', { colors: true, prettyPrint: true }),
          ),
        }),
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: `%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(
              (info) =>
                `${info.timestamp} [${info.level}] ${
                  Object.keys(info).length ? JSON.stringify(info) : ''
                  // Object.keys(info).length ? JSON.stringify(info, null, 2) : ''
                }`,
            ),
          ),
        }),
      ],
    }),
    TypeormLogModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, TypeormLogModule],
      inject: [ConfigService, TypeormLogService],
      useFactory: async (configService: ConfigService, log: TypeormLogService) => {
        const appconfig = configService.get<AppDbConfig>('db');
        return {
          name: 'test-crash',
          type: 'mysql', // 数据库类型
          entities: [UserEntity, PowerEntity, RoleEntity, MenuEntity], // 数据表实体
          host: appconfig.host, // 主机，默认为localhost
          port: appconfig.port, // 端口号
          username: appconfig.user, // 用户名
          password: appconfig.password, // 密码
          database: appconfig.database, //数据库名
          // timezone: '+08:00', //服务器上配置的时区
          logging: true,
          logger: log, // 'advanced-console',
          synchronize: false, //根据实体自动创建数据库表， 生产环境建议关闭
        };
      },
    }),
    PowerModule,
    RoleModule,
    UserModule,
    MenuModule,
    AuthModule,
    RedisModule,
    TypeormLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
