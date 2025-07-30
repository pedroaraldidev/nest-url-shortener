import { Module } from '@nestjs/common';
import { UserModule } from '../../../user/user.module';
import { UserSeed } from './user.seed';
import { SeedRunner } from './seed.runner';

@Module({
  imports: [UserModule],
  providers: [UserSeed, SeedRunner],
  exports: [SeedRunner],
})
export class SeedsModule {} 