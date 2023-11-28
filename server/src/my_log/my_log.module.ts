import { Module } from '@nestjs/common';
import { MyLogService } from './my_log.service';
import { MyLogController } from './my_log.controller';

@Module({
  controllers: [MyLogController],
  providers: [MyLogService]
})
export class MyLogModule {}
