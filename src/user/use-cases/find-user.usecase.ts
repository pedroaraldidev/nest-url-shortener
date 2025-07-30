import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository.interface';
import { User } from '../entities/user.entity';
import { UserNotFoundException } from '../../common/exceptions/user.exceptions';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}


  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
