import { Injectable } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { FindAllUsersUseCase } from './use-cases/find-all-users.usecase';
import { FindUserUseCase } from './use-cases/find-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly filterAllUseCase: FindAllUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async create(createUserDto: CreateUserDto, currentUser?: User): Promise<User> {
    return this.createUserUseCase.execute(createUserDto, currentUser);
  }

  async findAll(): Promise<User[]> {
    return this.filterAllUseCase.execute();
  }

  async findOne(id: number): Promise<User> {
    return this.findUserUseCase.execute(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser?: User): Promise<User> {
    return this.updateUserUseCase.execute(id, updateUserDto, currentUser);
  }

  async delete(id: number): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
