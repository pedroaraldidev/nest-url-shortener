import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UrlModule } from './url/url.module';
import { SeedsModule } from './database/typeorm/seeds/seeds.module';
import typeormConfig from './config/typeorm.config';
import { IpDetectionMiddleware } from './common/middleware/ip-detection.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UserModule,
    AuthModule,
    UrlModule,
    SeedsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpDetectionMiddleware)
      .forRoutes('*');
  }
}
