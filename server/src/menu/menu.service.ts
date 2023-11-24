import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Net_Retcode } from 'src/entity/constant';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { MenuEntity } from './menu.entity';

@Injectable()
export class MenuService extends BaseCrudService<MenuEntity> {
  constructor(
    @InjectRepository(MenuEntity)
    protected readonly menuRepository: Repository<MenuEntity>,
  ) {
    super();
    this.init(menuRepository, MenuEntity);
  }

  async addOne(info: Partial<MenuEntity>): Promise<MenuEntity> {
    const { title } = info;
    if (!title) {
      throw new HttpException('缺少标题', Net_Retcode.ERR);
    }
    return await super.addOne(info);
  }

  getListBuilder(qb: SelectQueryBuilder<MenuEntity>) {
    qb.orderBy('menu.sorts', 'DESC');
  }
}
