import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserAlreadyExistsException, InsufficientPermissionsException } from '../../common/exceptions/user.exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto, currentUser?: User): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException('Email already exists');
    }

    if (createUserDto.user_type === 'admin' && currentUser && currentUser.user_type !== 'admin') {
      throw new InsufficientPermissionsException('Only admins can create admin users');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = Object.assign(new User(), {
      ...createUserDto,
      password: hashedPassword,
      user_type: createUserDto.user_type || 'user',
    });

    try {
      const createdUser = await this.userRepository.create(newUser);
      return createdUser;
    } catch (error) {
      if (error.message?.includes('UNIQUE constraint failed') || 
          error.message?.includes('Duplicate entry')) {
        throw new UserAlreadyExistsException('Email already exists');
      }
      throw error;
    }
  }
}