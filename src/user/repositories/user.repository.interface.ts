import { User } from '../entities/user.entity';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
    findAll(filter?: Partial<User>): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(user: Omit<User, 'id'>): Promise<User>;
    update(id: number, userData: Partial<User>): Promise<User>;
    delete(id: number): Promise<void>;
  }