import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthToken } from './entities/auth-token.entity';

import { ITokenRepository } from './repositories/token.repository.interface';
import { TokenTypeOrmRepository } from './repositories/typeorm/token.typeorm.repository';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LoginUseCase } from './use-cases/login.usecase';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'development',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginUseCase,
    {
      provide: ITokenRepository,
      useClass: TokenTypeOrmRepository,
    },
    JwtAuthGuard,
    OptionalJwtAuthGuard
  ],
  exports: [JwtModule, JwtAuthGuard, OptionalJwtAuthGuard],
})
export class AuthModule {}