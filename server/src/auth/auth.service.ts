import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/db/redis/redis.service';
import { Loginreq, TokenPayload } from 'src/entity/api.entity';
import { AppHttpConfig } from 'src/entity/config';
import { UserEntity } from 'src/user/user.entity';
import { getTokenRedisKey } from 'src/utils/redis';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { Net_Retcode } from 'src/entity/constant';
import { compareSync } from 'bcrypt';
import { IncomingHttpHeaders } from 'http';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redis: RedisService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly config: ConfigService,
  ) {}
  async login(req: Request) {
    const user = await this.CheckLogin(req);
    const payload: TokenPayload = { user_name: user.user_name, id: user.id };
    const access_token = this.jwtService.sign(payload);
    const http_config = this.config.get<AppHttpConfig>('http');
    await this.redis.set(getTokenRedisKey(user.id), access_token, http_config.token_expire_in);
    return {
      access_token,
    };
  }
  async logout(user: Partial<UserEntity>) {
    await this.redis.del(getTokenRedisKey(user.id));
  }

  static getToken(req_header: IncomingHttpHeaders): string {
    const token = req_header.authorization.replace('Bearer ', '');
    return token;
  }

  getTokenPayLoad(req_header: IncomingHttpHeaders): TokenPayload {
    const token = AuthService.getToken(req_header);
    return this.jwtService.decode(token) as TokenPayload;
  }

  // async CheckToken(req_header: IncomingHttpHeaders) {
  async CheckToken(token: string) {
    const http_config = this.config.get<AppHttpConfig>('http');
    // const token = AuthService.getToken(req_header);
    const payload = this.jwtService.decode(token) as TokenPayload;
    const token_id = getTokenRedisKey(payload.id);
    const cache_token = await this.redis.get(token_id);
    if (!cache_token) throw new UnauthorizedException('token 过期');
    if (token !== cache_token) throw new UnauthorizedException('token 错误');
    const exituser = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    if (!exituser) throw new UnauthorizedException('token验证失败');
    await this.redis.set(token_id, token, http_config.token_expire_in);
    return exituser;
  }

  async CheckLogin(req: Request) {
    const login_req = req.body as Loginreq;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.user_name=:username', { username: login_req.user_name })
      .getOne();
    if (!user) throw new HttpException('用户不存在', Net_Retcode.ERR);
    if (!compareSync(login_req.password, user.password)) {
      throw new HttpException('密码错误', Net_Retcode.ERR);
    }
    return user;
  }
}
