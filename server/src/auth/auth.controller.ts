import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorator/public.decorator';
import { Request } from 'express';
import { Loginreq } from 'src/entity/api.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @Public()
  @ApiBody({ type: Loginreq })
  login(@Req() req: Request) {
    return this.authservice.login(req.user);
  }

  @Get('logout')
  @Public()
  async logout(@Body() req: { id: number }) {
    await this.authservice.logout(req);
  }
}
