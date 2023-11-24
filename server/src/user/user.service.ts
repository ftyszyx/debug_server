import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Net_Retcode } from 'src/entity/constant';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { ConfigService } from '@nestjs/config';
import { ChangePassReq } from 'src/entity/api.entity';
import * as bcrypt from 'bcrypt';
import { AppDetailConfig } from 'src/entity/other';

@Injectable()
export class UserService extends BaseCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly config: ConfigService,
  ) {
    super();
    this.init(usersRepository, UserEntity);
  }

  async addOne(user: Partial<UserEntity>): Promise<UserEntity> {
    const { user_name } = user;
    if (!user_name) {
      throw new HttpException('缺少用户名', Net_Retcode.ERR);
    }
    const res = await this.usersRepository.findOne({ where: { user_name } });
    if (res) {
      throw new HttpException('用户重名', Net_Retcode.ERR);
    }
    user.password = this.config.get<AppDetailConfig>('app').password_init;
    user.desc = user.desc || '';
    return await super.addOne(user);
  }
  getListBuilder(qb: SelectQueryBuilder<UserEntity>) {
    qb.orderBy('user.create_time', 'DESC');
  }

  async changePass(req: ChangePassReq): Promise<void> {
    const pass = bcrypt.hashSync(req.new_pass, 10);
    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({
        password: pass,
      })
      .where('id=:id', { id: req.id })
      .execute();
  }
}
