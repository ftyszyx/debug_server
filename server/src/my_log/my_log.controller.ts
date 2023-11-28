import { Controller } from '@nestjs/common';
import { MyLogService } from './my_log.service';

@Controller('my-log')
export class MyLogController {
  constructor(private readonly myLogService: MyLogService) {}
}
