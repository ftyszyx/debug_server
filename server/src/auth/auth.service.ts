import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/db/redis/redis.service';
import { AppHttpConfig } from 'src/entity/other';
import { UserEntity } from 'src/user/user.entity';
import { getTokenRedisKey } from 'src/utils/redis';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redis: RedisService,
    private config: ConfigService,
  ) {}
  async login(user: Partial<UserEntity>) {
    // console.log('user login', user);
    const payload = { user_name: user.user_name, id: user.id };
    const access_token = this.jwtService.sign(payload);
    const http_config = this.config.get<AppHttpConfig>('http');
    await this.redis.set(getTokenRedisKey(user.id), access_token, http_config.token_expire_in);
    return {
      access_token,
      // type: 'Bearer',
    };
  }
  async logout(user: Partial<UserEntity>) {
    await this.redis.del(getTokenRedisKey(user.id));
  }
}
