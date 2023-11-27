import { Module } from '@nestjs/common';
import { DebugServerService } from './debug_server.service';

@Module({ imports: [], providers: [DebugServerService] })
export class DebugServerModule {}
