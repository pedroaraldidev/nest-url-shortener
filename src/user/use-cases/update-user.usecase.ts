import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserNotFoundException, InsufficientPermissionsException, UserAlreadyExistsException } from '../../common/exceptions/user.exceptions';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number, updateUserDto: UpdateUserDto, currentUser?: User): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(`User with ID ${id} not found`);
    }
    
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new UserAlreadyExistsException('Email already exists');
      }
    }
    
    if (updateUserDto.user_type && updateUserDto.user_type !== user.user_type) {
      if (!currentUser || currentUser.user_type !== 'admin') {
        throw new InsufficientPermissionsException('Only admins can change user types');
      }
    }
    
    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.email || user.email;
    user.user_type = updateUserDto.user_type || user.user_type;
    
    try {
      return await this.userRepository.update(id, user);
    } catch (error) {
      if (error.message?.includes('UNIQUE constraint failed') || 
          error.message?.includes('Duplicate entry')) {
        throw new UserAlreadyExistsException('Email already exists');
      }
      throw error;
    }
  }
}
