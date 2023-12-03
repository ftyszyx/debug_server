import { Module } from '@nestjs/common';
import { DebugClientService } from './debug_client.service';
import { DebugClientController } from './debug_client.controller';
import { DebugServerModule } from 'src/debug_server/debug_server.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebugClientEntity } from './debug_client.entity';

@Module({
  imports: [DebugServerModule, TypeOrmModule.forFeature([DebugClientEntity])],
  controllers: [DebugClientController],
  providers: [DebugClientService],
})
export class DebugClientModule {}
