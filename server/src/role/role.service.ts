import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Net_Retcode, RoleType } from 'src/entity/constant';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { RoleEntity } from './role.entity';
import { MenuEntity } from 'src/menu/menu.entity';
import { PowerEntity } from 'src/power/power.entity';
import { RedisService } from 'src/db/redis/redis.service';
import { getRoleRedisKey } from 'src/utils/redis';

@Injectable()
export class RoleService extends BaseCrudService<RoleEntity> {
  constructor(
    private readonly redis: RedisService,
    @InjectRepository(RoleEntity)
    protected readonly roleRepository: Repository<RoleEntity>,
  ) {
    super();
    this.init(roleRepository, RoleEntity);
  }

  async addOne(info: Partial<RoleEntity>): Promise<RoleEntity> {
    const { title } = info;
    if (!title) {
      throw new HttpException('缺少标题', Net_Retcode.ERR);
    }

    return await super.addOne(info);
  }

  getListBuilder(qb: SelectQueryBuilder<RoleEntity>) {
    qb.orderBy('role.sorts', 'DESC');
  }

  async after_change(_data: RoleEntity[]): Promise<void> {
    _data.forEach(async (item) => {
      await this.redis.del(getRoleRedisKey(item.id));
    });
  }

  private async upRolesArrayPropertyByKey(item_key: string, item_value: number, role_ids: number[]) {
    console.log('change', item_key, item_value, role_ids);
    const allroles = await this.repository.createQueryBuilder().getMany();
    const item_value_str = item_value.toString();
    for (let i = 0; i < allroles.length; i++) {
      const item = allroles[i];
      if (item.id == RoleType.SuperAdmin) continue;
      const str_list: string[] = item[item_key] || [];
      const idx = str_list.findIndex((value) => value == item_value_str);
      if (role_ids.includes(item.id)) {
        if (idx == -1) {
          str_list.push(item_value_str);
        } else {
          continue;
        }
      } else {
        if (idx > -1) {
          str_list.splice(idx, 1);
        } else {
          continue;
        }
      }
      console.log('change role', item.id, str_list);
      await this.repository
        .createQueryBuilder()
        .update(RoleEntity)
        .set({ [item_key]: str_list })
        .where('role.id =:id', { id: item.id })
        .execute();
    }
    return;
  }

  async upRolePower(powerid: number, role_ids: number[]) {
    await this.upRolesArrayPropertyByKey('powers', powerid, role_ids);
  }

  async upRoleMenu(menuid: number, role_ids: number[]) {
    await this.upRolesArrayPropertyByKey('menus', menuid, role_ids);
  }

  async recv_data_fix(_data: RoleEntity[]): Promise<void> {
    _data.forEach((item) => {
      item.desc = item.desc || '';
      item.menus = item.menus || [];
      item.powers = item.powers || [];
    });
  }
  async send_data_fix(items: RoleEntity[]) {
    const all_menu = [];
    const all_power = [];
    //添加管理员
    for (let i = 0; i < items.length; i++) {
      const info = items[i];
      if (info.id == RoleType.SuperAdmin) {
        if (all_menu.length == 0) {
          const all_menu_res = await this.dataSource.createQueryBuilder().select(['menu.id']).from(MenuEntity, 'menu').getMany();
          all_menu_res.forEach((item) => {
            all_menu.push(item.id);
          });
          const all_power_res = await this.dataSource
            .createQueryBuilder()
            .select(['power.id'])
            .from(PowerEntity, 'power')
            .getMany();
          all_power_res.forEach((item) => {
            all_power.push(item.id);
          });
          // console.log('get allmenu:', all_menu_res, all_power_res, all_menu, all_power);
        }
        info.menus = all_menu;
        info.powers = all_power;
      }
    }
    // console.log('get res:', items);
  }
}
