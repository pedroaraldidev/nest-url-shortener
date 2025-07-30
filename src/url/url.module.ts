import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UrlController } from './url.controller';
import { Url } from './entities/url.entity';
import { Click } from './entities/click.entity';
import { UrlRepository } from './repositories/typeorm/url.repository';
import { ClickRepository } from './repositories/typeorm/click.repository';
import { CreateUrlUseCase } from './use-cases/create-url.usecase';
import { RedirectUrlUseCase } from './use-cases/redirect-url.usecase';
import { FindUserUrlsUseCase } from './use-cases/find-user-urls.usecase';
import { UpdateUrlUseCase } from './use-cases/update-url.usecase';
import { DeleteUrlUseCase } from './use-cases/delete-url.usecase';
import { UrlOwnershipGuard } from './guards/url-ownership.guard';
import { IUrlRepository } from './repositories/url.repository.interface';
import { IClickRepository } from './repositories/click.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url, Click]),
    AuthModule,
  ],
  controllers: [UrlController],
  providers: [
    UrlRepository,
    ClickRepository,
    CreateUrlUseCase,
    RedirectUrlUseCase,
    FindUserUrlsUseCase,
    UpdateUrlUseCase,
    DeleteUrlUseCase,
    UrlOwnershipGuard,
    {
      provide: IUrlRepository,
      useClass: UrlRepository,
    },
    {
      provide: IClickRepository,
      useClass: ClickRepository,
    },
  ],
  exports: [
    UrlRepository,
    ClickRepository,
    CreateUrlUseCase,
    RedirectUrlUseCase,
    FindUserUrlsUseCase,
    UpdateUrlUseCase,
    DeleteUrlUseCase,
  ],
})
export class UrlModule {} 