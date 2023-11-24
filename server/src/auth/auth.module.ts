import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { LocalStrategy } from 'src/core/strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AppHttpConfig } from 'src/entity/other';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configservice: ConfigService) => {
    const httpconfig = configservice.get<AppHttpConfig>('http');
    return {
      secretOrPrivateKey: httpconfig.token_secret_key,
      signOptions: {
        // expiresIn: httpconfig.token_expire_time
      },
    };
  },
});
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), jwtModule],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService],
  exports: [jwtModule],
})
export class AuthModule {}
