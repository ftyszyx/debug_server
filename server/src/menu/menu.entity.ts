import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('menu')
export class MenuEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ length: 50 })
  @ApiProperty()
  title: string;

  @Column({ length: 50 })
  @ApiProperty()
  icon_style_type: string;

  @Column({ length: 255 })
  @ApiProperty()
  url: string;

  @Column('int')
  @ApiProperty()
  parent: number;

  @Column('text')
  @ApiProperty()
  desc: string;

  @Column('tinyint')
  @ApiProperty()
  sorts: number;

  @Column('tinyint')
  @ApiProperty()
  status: number;
}
