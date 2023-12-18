import { Injectable } from '@nestjs/common';
import { BaseCrudService } from 'src/utils/base_crud.sevice';
import { MyLogEntity } from './my_log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MyLogService extends BaseCrudService<MyLogEntity> {
  constructor(
    @InjectRepository(MyLogEntity)
    private readonly usersRepository: Repository<MyLogEntity>,
  ) {
    super();
    this.init(usersRepository, MyLogEntity);
  }
}
