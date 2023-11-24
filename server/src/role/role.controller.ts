import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { IdsReq, ListReq, ListReqSwagger, UpReq, UpRoleMenuReq, UpRolePowerReq } from 'src/entity/api.entity';
import { RoleService } from './role.service';
import { RoleEntity } from './role.entity';
import { PowerCode } from 'src/core/decorator/power.decorator';
import { ModuleType, PowerCodeType } from 'src/entity/constant';
@Controller('role')
@ApiBearerAuth()
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post('getList')
  @PowerCode({ module: ModuleType.Role, code: PowerCodeType.See })
  @ApiBody({ type: ListReqSwagger })
  async getList(@Body() req_parms: ListReq<RoleEntity>) {
    return await this.roleService.getList(req_parms);
  }

  @Get('getAll')
  async getAll() {
    return await this.roleService.getAll();
  }
  @Post('getByIds')
  async getByIds(@Body() req: IdsReq) {
    return await this.roleService.findByIds(req.ids);
  }
  @Post('add')
  @PowerCode({ module: ModuleType.Role, code: PowerCodeType.Add })
  async add(@Body() user: RoleEntity) {
    console.log('user add ');
    return await this.roleService.addOne(user);
  }
  @Post('up')
  @PowerCode({ module: ModuleType.Role, code: PowerCodeType.Up })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'number' }, data: { $ref: getSchemaPath(RoleEntity) } } } })
  async up(@Body() query: UpReq<RoleEntity>) {
    return await this.roleService.updateById(query.id, query.data);
  }
  @Post('del')
  @PowerCode({ module: ModuleType.Role, code: PowerCodeType.Del })
  async del(@Body() req: number[]) {
    return await this.roleService.remove(req);
  }
  @Post('upRolesPower')
  @PowerCode({ module: ModuleType.Role, code: PowerCodeType.Up })
  async upRolesPower(@Body() req: UpRolePowerReq) {
    return await this.roleService.upRolePower(req.power_id, req.role_ids);
  }
  @Post('upRolesMenu')
  @PowerCode({ module: ModuleType.Role, code: PowerCodeType.Up })
  async upRolesMenu(@Body() req: UpRoleMenuReq) {
    return await this.roleService.upRoleMenu(req.menu_id, req.role_ids);
  }
}
