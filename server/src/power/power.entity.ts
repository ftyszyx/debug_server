import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('power')
export class PowerEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @ApiProperty()
  @Column({ length: 50 })
  title: string; // 标题

  @ApiProperty()
  @Column({ length: 50 })
  module: string; //

  @ApiProperty()
  @Column({ length: 50 })
  code: string; // CODE

  @ApiProperty()
  @Column('text')
  desc: string; // 描述

  @ApiProperty()
  @Column('int')
  sorts: number; // 排序

  @ApiProperty()
  @Column('tinyint')
  status: number; // 状态 1启用，0禁用
}
