import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy, JwtStrategy, LocalStrategy } from './stragegies';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MailSender } from 'src/util/mailsend';
import { EncryptionService } from 'src/util/encryption';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    MailSender,
    EncryptionService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
