import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AfterLoad, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @ApiProperty()
  user_name: string; // 用户名

  @Column({ length: 255, select: false })
  @ApiProperty()
  // @IsNotEmpty({ message: '密码不能为空' })
  password: string; // 密码

  @Column({ length: 50 })
  @ApiPropertyOptional()
  phone: string; // 手机

  @Column({ length: 50 })
  @ApiPropertyOptional()
  // @IsEmail()
  email: string; // 邮箱

  @Column('text')
  @ApiPropertyOptional()
  desc: string; // 描述

  @Column('tinyint')
  @ApiPropertyOptional()
  status: number; // 状态 1启用，0禁用

  @Column('simple-array')
  @ApiPropertyOptional()
  roles: number[]; // 拥有的所有角色ID

  @ApiPropertyOptional()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @BeforeInsert()
  async hashPassword() {
    // console.log('before add', this);
    if (this.password) this.password = bcrypt.hashSync(this.password, 10);
  }

  @AfterLoad()
  async changeData() {
    this.roles = this.roles.map(Number);
  }
}
