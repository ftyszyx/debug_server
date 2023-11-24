import { DataSource, EntityTarget, FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { ListReq, ListResp } from 'src/entity/api.entity';
import { filterQuery } from 'src/utils/sql.util';
import { HttpException, Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { Net_Retcode } from 'src/entity/constant';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export abstract class BaseCrudService<EntityT extends object> implements OnModuleInit {
  public col_names: string[] = [];
  public table_name: string;
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  protected readonly logger: LoggerService;
  @Inject(DataSource)
  protected readonly dataSource: DataSource;
  protected repository: Repository<EntityT>;
  protected entity: EntityTarget<EntityT>;
  onModuleInit() {
    const userMeta = this.dataSource.getMetadata(this.entity);
    this.col_names = userMeta.columns.map((col) => col.propertyName);
    this.table_name = userMeta.tableName;
  }

  logInfo(message) {
    this.logger.log(message, this.table_name);
  }
  logErr(message) {
    this.logger.error(message, this.table_name);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async send_data_fix(_data: EntityT[]) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async recv_data_fix(_data: EntityT[]) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async after_change(_data: EntityT[]) {}
  init(respository: Repository<EntityT>, entity: EntityTarget<EntityT>) {
    this.repository = respository;
    this.entity = entity;
  }
  async addOne(info: Partial<EntityT>): Promise<EntityT> {
    const new_data = this.repository.create();
    const entity = Object.assign(new_data, info);
    await this.recv_data_fix([entity as EntityT]);
    const res = await this.repository.save(entity as EntityT);
    await this.send_data_fix([res]);
    return res;
  }

  async getAll(): Promise<EntityT[]> {
    const res_list = await this.repository.createQueryBuilder(this.table_name).getMany();
    await this.send_data_fix(res_list);
    return res_list;
  }

  abstract getListBuilder(qb: SelectQueryBuilder<EntityT>);
  async getList(query: ListReq<EntityT>): Promise<ListResp<EntityT>> {
    const qb = await this.repository.createQueryBuilder(this.table_name);
    // this.getListBuilder(qb);
    filterQuery(qb, query, this.col_names);
    const count = await qb.getCount();
    const { pageNum, pageSize } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
    const res_items = await qb.getMany();
    await this.send_data_fix(res_items);
    return { list: res_items, total: count };
  }

  async findById(id): Promise<EntityT> {
    // console.log('find by id', id);
    const res_item = await this.repository.findOne({ where: { id } as FindOptionsWhere<EntityT> });
    await this.send_data_fix([res_item]);
    // console.log('get item', res_item);
    return res_item;
  }

  async findByIds(ids): Promise<EntityT[]> {
    let res_items: EntityT[] = [];
    if (ids) {
      if (ids.length > 1) {
        // console.log('setlect array');
        res_items = await this.repository
          .createQueryBuilder(this.table_name)
          .where(this.table_name + '.id in (:ids)', { ids: ids })
          .getMany();
        // console.log('get items', res_items);
      } else if (ids.length == 1) {
        const id = ids[0];
        const item = await this.repository.findOneBy({ id } as FindOptionsWhere<EntityT>);
        res_items = [item];
      } else {
        throw new HttpException('参数异常', Net_Retcode.ERR);
      }
    }
    await this.send_data_fix(res_items);
    return res_items;
  }

  async updateById(id, info: EntityT): Promise<EntityT> {
    const oldone = await this.repository.findOneBy({ id } as FindOptionsWhere<EntityT>);
    if (!oldone) {
      throw new HttpException(`id为${id}数据不存在`, Net_Retcode.ERR);
    }
    delete info['id'];
    const res = this.repository.merge(oldone, info);
    await this.recv_data_fix([res]);
    const res_item = await this.repository.save(res);
    await this.send_data_fix([res_item]);
    await this.after_change([res_item]);
    return res_item;
  }

  async remove(id) {
    const oldone = await this.repository.findOneBy({ id } as FindOptionsWhere<EntityT>);
    if (!oldone) {
      throw new HttpException(`id为${id}数据不存在`, Net_Retcode.ERR);
    }
    await this.repository.remove(oldone);
    await this.after_change([oldone]);
  }
}
