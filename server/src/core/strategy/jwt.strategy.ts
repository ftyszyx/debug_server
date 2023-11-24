import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, StrategyOptions, Strategy } from 'passport-jwt';
import { RedisService } from 'src/db/redis/redis.service';
import { AppHttpConfig } from 'src/entity/other';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { getTokenRedisKey } from 'src/utils/redis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    const httpvalue = config.get<AppHttpConfig>('http');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: httpvalue.token_secret_key,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(req: Request, payload: UserEntity) {
    // console.log('jwt strategy valid', req);
    const http_config = this.config.get<AppHttpConfig>('http');
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    // console.log('get token', token);
    const token_id = getTokenRedisKey(payload.id);
    const cache_token = await this.redis.get(token_id);
    if (!cache_token) throw new UnauthorizedException('token 过期');
    if (token !== cache_token) throw new UnauthorizedException('token 错误');
    const exituser = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    if (!exituser) throw new UnauthorizedException('token验证失败');
    await this.redis.set(token_id, token, http_config.token_expire_in);
    // console.log('get user', exituser);
    req['user'] = exituser;
    return exituser;
  }
}
