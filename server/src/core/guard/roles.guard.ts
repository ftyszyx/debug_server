import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from 'src/entity/constant';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { POWER_KEY, PowerCodeMeta } from '../decorator/power.decorator';
import { UserEntity } from 'src/user/user.entity';
import { RedisService } from 'src/db/redis/redis.service';
import { getPowerRedisKey, getRoleRedisKey } from 'src/utils/redis';
import { PowerEntity } from 'src/power/power.entity';
import { DataSource } from 'typeorm';
import { RoleEntity } from 'src/role/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(DataSource)
    protected readonly dataSource: DataSource,
    private reflector: Reflector,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const code_info = this.reflector.getAllAndOverride<PowerCodeMeta>(POWER_KEY, [context.getHandler(), context.getClass()]);
    const ispublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (ispublic) return true;
    if (!code_info) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;
    const userinfo = user as UserEntity;
    if (userinfo.roles.includes(RoleType.SuperAdmin)) return true;
    // console.log('role guard', user, code_info);
    for (let i = 0; i < userinfo.roles.length; i++) {
      const role_id = userinfo.roles[i];
      const role_key = getRoleRedisKey(role_id);
      let role_info = await this.redis.get<RoleEntity>(role_key);
      // console.log('get role', role_info);
      if (!role_info) {
        role_info = await this.dataSource.getRepository(RoleEntity).findOne({
          where: { id: role_id },
        });
        // console.log('cache role', role_info);
        await this.redis.set(role_key, role_info, 0);
      }

      let power_list: PowerEntity[] = [];
      if (role_info.powers.length > 0) {
        for (let j = 0; j < role_info.powers.length; j++) {
          const powerid = role_info.powers[j];
          const power_info = await this.redis.get<PowerEntity>(getPowerRedisKey(powerid));
          if (power_info == null) {
            power_list = [];
            break;
          }
          power_list.push(power_info);
        }
        if (power_list.length == 0) {
          // console.log('get powers', role_info.powers);
          power_list = await this.dataSource
            .getRepository(PowerEntity)
            .createQueryBuilder('power')
            .where(`power.id in (:invalues)`, { invalues: role_info.powers })
            .getMany();

          // console.log('cache powers', power_list);
          power_list.forEach(async (item) => {
            await this.redis.set(getPowerRedisKey(item.id), item, 0);
          });
        }
      }
      const find_one = power_list.find((x) => x.module == code_info.module && x.code === code_info.code);
      if (find_one) {
        console.log('find power', find_one);
        return true;
      }
    }
    return false;
  }
}
