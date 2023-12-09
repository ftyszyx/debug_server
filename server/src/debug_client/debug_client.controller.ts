import { Body, Controller, Post } from '@nestjs/common';
import { DebugClientService } from './debug_client.service';
import { ApiBearerAuth, ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ListReq, ListReqSwagger, UpReq } from 'src/entity/api.entity';
import { DebugClientEntity } from './debug_client.entity';
import { ModuleType, PowerCodeType } from 'src/entity/constant';
import { PowerCode } from 'src/core/decorator/power.decorator';

@Controller('debug-client')
@ApiTags('deubg_client')
@ApiBearerAuth()
export class DebugClientController {
  constructor(private readonly debugClientService: DebugClientService) {}

  @Post('getList')
  @PowerCode({ module: ModuleType.Debug_client, code: PowerCodeType.See })
  @ApiBody({ type: ListReqSwagger })
  async getList(@Body() req_params: ListReq<DebugClientEntity>) {
    return await this.debugClientService.getList(req_params);
  }

  @Post('up')
  @PowerCode({ module: ModuleType.User, code: PowerCodeType.Up })
  @ApiBody({
    schema: { type: 'object', properties: { id: { type: 'number' }, data: { $ref: getSchemaPath(DebugClientEntity) } } },
  })
  async up(@Body() query: UpReq<DebugClientEntity>) {
    return await this.debugClientService.updateById(query.id, query.data);
  }
}
