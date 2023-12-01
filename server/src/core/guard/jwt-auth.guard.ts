import { ExecutionContext, Injectable } from '@nestjs/common';
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
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ispublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (ispublic) return true;
    // console.log('jwt guard');
    const request = context.switchToHttp().getRequest() as Request;
    const user = this.auth.CheckToken(request.headers);
    request['user'] = user;
    return user != null;
  }
}
