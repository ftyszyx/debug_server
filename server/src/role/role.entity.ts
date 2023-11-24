import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ length: 50 })
  @ApiProperty()
  title: string;

  @Column('text')
  @ApiProperty()
  desc: string;

  @Column('tinyint')
  @ApiProperty()
  sorts: number;

  @Column('tinyint')
  @ApiProperty()
  status: number;

  @Column('simple-array')
  @ApiProperty()
  menus: number[];

  @Column('simple-array')
  @ApiProperty()
  powers: number[];

  @AfterLoad()
  async changeData() {
    this.powers = this.powers.map(Number);
    this.menus = this.menus.map(Number);
  }
}
