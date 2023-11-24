import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppRedisConfig } from 'src/entity/other';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redis_config = config.get<AppRedisConfig>('redis');
        const store = await redisStore({
          socket: {
            host: redis_config.host,
            port: redis_config.port,
          },
          ttl: redis_config.ttl,
        });
        return {
          store,
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
