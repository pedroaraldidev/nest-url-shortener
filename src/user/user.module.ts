import { Delete, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

import { IUserRepository } from './repositories/user.repository.interface';
import { UserTypeOrmRepository } from './repositories/typeorm/user.typeorm.repository';

import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { FindAllUsersUseCase } from './use-cases/find-all-users.usecase';
import { FindUserUseCase } from './use-cases/find-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';




@Module({
  imports: [TypeOrmModule.forFeature([User])], 
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserTypeOrmRepository,
    },
    UserService,
    CreateUserUseCase,
    UpdateUserUseCase,
    FindAllUsersUseCase,
    FindUserUseCase,
    DeleteUserUseCase
  ],
  exports: [
    {
      provide: IUserRepository,
      useClass: UserTypeOrmRepository,
    },
    UserService,
  ],
})
export class UserModule {}