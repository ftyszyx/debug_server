import { BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import { IStrategyOptions, Strategy } from 'passport-local';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
    super({
      usernameField: 'user_name',
      passwordField: 'password',
    } as IStrategyOptions);
  }
  async validate(username: string, password: string): Promise<any> {
    console.log(' valid username:', username, password);
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.user_name=:username', { username })
      .getOne();
    if (!user) throw new BadRequestException('用户不存在');
    if (!compareSync(password, user.password)) {
      console.log('true pass', user.password);
      throw new BadRequestException('密码错误');
    }
    // console.log('valid ok', user);
    return user;
  }
}
