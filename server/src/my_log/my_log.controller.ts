import { MyLogService } from './my_log.service';
import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { ApiBody, getSchemaPath } from '@nestjs/swagger';
import { ListReq, ListReqSwagger, UpReq } from 'src/entity/api.entity';
import { ModuleType, PowerCodeType } from 'src/entity/constant';
import { PowerCode } from 'src/core/decorator/power.decorator';
import { MyLogEntity } from './my_log.entity';
@Controller('my-log')
export class MyLogController {
  constructor(private readonly myLogService: MyLogService) {}
  @Post('getList')
  @PowerCode({ module: ModuleType.User, code: PowerCodeType.See })
  @ApiBody({ type: ListReqSwagger })
  async getList(@Body() req_parms: ListReq<MyLogEntity>) {
    return await this.myLogService.getList(req_parms);
  }

  @Post('up')
  @PowerCode({ module: ModuleType.User, code: PowerCodeType.Up })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'number' }, data: { $ref: getSchemaPath(MyLogEntity) } } } })
  async up(@Body() query: UpReq<MyLogEntity>) {
    return await this.myLogService.updateById(query.id, query.data);
  }
  @Post('del')
  @PowerCode({ module: ModuleType.User, code: PowerCodeType.Del })
  async del(@Body() req: number[]) {
    return await this.myLogService.remove(req);
  }
}
