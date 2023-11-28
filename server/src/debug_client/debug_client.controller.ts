import { Controller } from '@nestjs/common';
import { DebugClientService } from './debug_client.service';

@Controller('debug-client')
export class DebugClientController {
  constructor(private readonly debugClientService: DebugClientService) {}
}
