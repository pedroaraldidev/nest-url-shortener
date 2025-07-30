import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../../../user/user.module';
import { UrlModule } from '../../../url/url.module';
import { UserSeed } from './user.seed';
import { UrlSeed } from './url.seed';
import { SeedRunner } from './seed.runner';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database.sqlite',
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    UserModule,
    UrlModule,
  ],
  providers: [UserSeed, UrlSeed, SeedRunner],
  exports: [SeedRunner],
})
export class SeedsModule {} 