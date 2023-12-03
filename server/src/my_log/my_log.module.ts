import { Module } from '@nestjs/common';
import { MyLogService } from './my_log.service';
import { MyLogController } from './my_log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLogEntity } from './my_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MyLogEntity])],
  controllers: [MyLogController],
  providers: [MyLogService],
})
export class MyLogModule {}
