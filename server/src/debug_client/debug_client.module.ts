import { Module } from '@nestjs/common';
import { DebugClientService } from './debug_client.service';
import { DebugClientController } from './debug_client.controller';

@Module({
  controllers: [DebugClientController],
  providers: [DebugClientService]
})
export class DebugClientModule {}
