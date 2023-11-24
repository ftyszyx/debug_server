import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { IdsReq, ListReq, ListReqSwagger, UpReq } from 'src/entity/api.entity';
import { PowerService } from './power.service';
import { PowerEntity } from './power.entity';
import { PowerCode } from 'src/core/decorator/power.decorator';
import { ModuleType, PowerCodeType } from 'src/entity/constant';
@Controller('power')
@ApiBearerAuth()
@ApiTags('power')
export class PowerController {
  constructor(private powerService: PowerService) {}
  @Post('getList')
  @PowerCode({ module: ModuleType.Power, code: PowerCodeType.See })
  @ApiBody({ type: ListReqSwagger })
  async getList(@Body() req_parms: ListReq<PowerEntity>): Promise<any> {
    return await this.powerService.getList(req_parms);
  }

  @Get('getAll')
  async getAll() {
    return await this.powerService.getAll();
  }
  @Post('getByIds')
  async getByIds(@Body() req: IdsReq) {
    return await this.powerService.findByIds(req.ids);
  }
  @Post('add')
  @PowerCode({ module: ModuleType.Power, code: PowerCodeType.Add })
  async add(@Body() user: PowerEntity) {
    return await this.powerService.addOne(user);
  }
  @Post('up')
  @PowerCode({ module: ModuleType.Power, code: PowerCodeType.Up })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'number' }, data: { $ref: getSchemaPath(PowerEntity) } } } })
  async up(@Body() query: UpReq<PowerEntity>) {
    return await this.powerService.updateById(query.id, query.data);
  }
  @Post('del')
  @PowerCode({ module: ModuleType.Power, code: PowerCodeType.Del })
  async del(@Body() req: number[]) {
    return await this.powerService.remove(req);
  }
}
