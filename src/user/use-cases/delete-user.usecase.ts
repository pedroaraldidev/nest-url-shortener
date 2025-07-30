import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserNotFoundException, UserAlreadyDeletedException } from '../../common/exceptions/user.exceptions';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }
    
    if (user.deletedAt) {
      throw new UserAlreadyDeletedException(`User with ID ${id} has already been deleted`);
    }
    
    user.deletedAt = new Date();
    await this.userRepository.update(id, user);
  }
}
