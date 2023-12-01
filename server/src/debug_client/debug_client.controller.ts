import { Body, Controller, Post } from '@nestjs/common';
import { DebugClientService } from './debug_client.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ListReq, ListReqSwagger } from 'src/entity/api.entity';
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
  async getList(@Body() req_params: ListReq<DebugClientEntity>) {}
}
