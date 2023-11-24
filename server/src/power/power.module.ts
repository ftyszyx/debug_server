import { Module } from '@nestjs/common';
import { PowerController } from './power.controller';
import { PowerService } from './power.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PowerEntity } from './power.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PowerEntity])],
  controllers: [PowerController],
  providers: [PowerService],
})
export class PowerModule {}
