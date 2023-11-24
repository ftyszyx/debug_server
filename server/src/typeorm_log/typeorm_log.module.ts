import { Module } from '@nestjs/common';
import { TypeormLogService } from './typeorm_log.service';

@Module({
  providers: [TypeormLogService],
  exports: [TypeormLogService],
})
export class TypeormLogModule {}
