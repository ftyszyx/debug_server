import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { IdsReq, ListReq, ListReqSwagger, UpReq } from 'src/entity/api.entity';
import { MenuService } from './menu.service';
import { MenuEntity } from './menu.entity';
import { PowerCode } from 'src/core/decorator/power.decorator';
import { ModuleType, PowerCodeType } from 'src/entity/constant';
@Controller('menu')
@ApiBearerAuth()
@ApiTags('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}
  @Post('getList')
  @ApiBody({ type: ListReqSwagger })
  @PowerCode({ module: ModuleType.Menu, code: PowerCodeType.See })
  async getList(@Body() req_parms: ListReq<MenuEntity>): Promise<any> {
    return await this.menuService.getList(req_parms);
  }

  @Get('getAll')
  async getAll() {
    return await this.menuService.getAll();
  }
  @Post('getByIds')
  async getByIds(@Body() req: IdsReq) {
    return await this.menuService.findByIds(req.ids);
  }
  @Post('add')
  @PowerCode({ module: ModuleType.Menu, code: PowerCodeType.Add })
  async add(@Body() user: MenuEntity) {
    return await this.menuService.addOne(user);
  }
  @Post('up')
  @PowerCode({ module: ModuleType.Menu, code: PowerCodeType.Up })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'number' }, data: { $ref: getSchemaPath(MenuEntity) } } } })
  async up(@Body() query: UpReq<MenuEntity>) {
    return await this.menuService.updateById(query.id, query.data);
  }
  @Post('del')
  @PowerCode({ module: ModuleType.Menu, code: PowerCodeType.Del })
  async del(@Body() req: number[]) {
    return await this.menuService.remove(req);
  }
}
