import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Net_Retcode } from 'src/entity/constant';
import { PowerEntity } from './power.entity';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { RedisService } from 'src/db/redis/redis.service';
import { getPowerRedisKey } from 'src/utils/redis';

@Injectable()
export class PowerService extends BaseCrudService<PowerEntity> {
  constructor(
    private readonly redis: RedisService,
    @InjectRepository(PowerEntity)
    protected readonly roleRepository: Repository<PowerEntity>,
  ) {
    super();
    this.init(roleRepository, PowerEntity);
  }

  async addOne(info: Partial<PowerEntity>): Promise<PowerEntity> {
    const { title } = info;
    if (!title) {
      throw new HttpException('缺少标题', Net_Retcode.ERR);
    }
    const res = await super.addOne(info);
    await this.redis.set(getPowerRedisKey(info.id), res);
    return res;
  }

  async after_change(_data: PowerEntity[]): Promise<void> {
    _data.forEach(async (item) => {
      await this.redis.del(getPowerRedisKey(item.id));
    });
  }

  getListBuilder(qb: SelectQueryBuilder<PowerEntity>) {
    qb.orderBy('power.sorts', 'DESC');
  }
}
