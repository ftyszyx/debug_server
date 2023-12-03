import { Module } from '@nestjs/common';
import { DebugServerService } from './debug_server.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugClientEntity } from 'src/debug_client/debug_client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DebugClientEntity])],
  providers: [DebugServerService],
  exports: [DebugServerService],
})
export class DebugServerModule {}
