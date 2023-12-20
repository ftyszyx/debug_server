import { MyLogService } from './my_log.service';
import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { ApiBody, getSchemaPath } from '@nestjs/swagger';
import { ListReq, ListReqSwagger, UpReq } from 'src/entity/api.entity';
import { ModuleType, PowerCodeType } from 'src/entity/constant';
import { PowerCode } from 'src/core/decorator/power.decorator';
import { MyLogEntity } from './my_log.entity';
@Controller('my_log')
export class MyLogController {
  constructor(private readonly myLogService: MyLogService) {}
  @Post('getList')
  @PowerCode({ module: ModuleType.User, code: PowerCodeType.See })
  @ApiBody({ type: ListReqSwagger })
  async getList(@Body() req_parms: ListReq<MyLogEntity>) {
    return await this.myLogService.getList(req_parms);
  }
}
