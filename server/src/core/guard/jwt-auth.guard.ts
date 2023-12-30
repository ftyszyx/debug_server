import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { AuthService } from 'src/auth/auth.service';
import type { Request } from 'express';
@Injectable()
export class JwtAuthGuard {
  constructor(
    private reflector: Reflector,
    private auth: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean | Promise<boolean> | Observable<boolean>> {
    const ispublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (ispublic) return true;
    const request = context.switchToHttp().getRequest() as Request;
    const token = AuthService.getToken(request.headers);
    const user = await this.auth.CheckToken(token);
    request['user'] = user;
    return user != null;
  }
}
