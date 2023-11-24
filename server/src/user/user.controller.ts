import { Body, Controller, Get, HttpException, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ChangeMyPassReq, ChangePassReq, ListReq, ListReqSwagger, UpReq } from 'src/entity/api.entity';
import { Request } from 'express';
import { ModuleType, Net_Retcode, PowerCodeType } from 'src/entity/constant';
import { PowerCode } from 'src/core/decorator/power.decorator';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add')
  @PowerCode({ module: ModuleType.User, code: PowerCodeType.Add })
  async add(@Body() user: UserEntity) {
    // console.log('user add ');
    return await this.userService.addOne(user);
  }

  @Get('getUserInfo')
  async getUserInfo(@Req() req): Promise<UserEntity> {
    const { user } = req;
    if (!user) {
      throw new HttpException('请登陆', Net_Retcode.NEEDLOGIN);
    }
    const userinfo = user as UserEntity;
    return await this.userService.findById(userinfo.id);
  }

  @Post('getList')
  @PowerCode({ module: ModuleType.User, code: PowerCodeType.See })
  @ApiBody({ type: ListReqSwagger })
  async getList(@Body() req_parms: ListReq<UserEntity>) {
    return await this.userService.getList(req_parms);
  }

  @Post('up')
  @PowerCode({ module: ModuleType.User, code: PowerCodeType.Up })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'number' }, data: { $ref: getSchemaPath(UserEntity) } } } })
  async up(@Body() query: UpReq<UserEntity>) {
    return await this.userService.updateById(query.id, query.data);
  }
  @Post('del')
  @PowerCode({ module: ModuleType.User, code: PowerCodeType.Del })
  async del(@Body() req: number[]) {
    return await this.userService.remove(req);
  }

  @Post('changePass')
  async changePass(@Body() req: ChangePassReq) {
    return await this.userService.changePass(req);
  }
  @Post('changeMyPass')
  @ApiBody({ type: ChangeMyPassReq })
  async changeMyPass(@Req() req: Request) {
    const userinfo = req.user as UserEntity;
    if (!userinfo) {
      throw new HttpException('请先登陆', Net_Retcode.NEEDLOGIN);
    }
    const { new_pass } = req.body;
    return await this.userService.changePass({ id: userinfo.id, new_pass });
  }
}
