import { Module } from '@nestjs/common';
import { DebugService } from './debug.service';

@Module({ imports: [], providers: [DebugService] })
export class DebugModule {}
