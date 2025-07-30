import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../user.repository.interface';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id, deletedAt: null });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email, deletedAt: null });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findBy({ deletedAt: null });
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}