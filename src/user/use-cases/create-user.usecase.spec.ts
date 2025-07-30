import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.usecase';
import { IUserRepository } from '../repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserAlreadyExistsException } from '../../common/exceptions/user.exceptions';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get(IUserRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const mockCreateUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      user_type: 'user',
    };

    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      user_type: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should create user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      userRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.execute(mockCreateUserDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...mockCreateUserDto,
        password: 'hashedPassword',
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw UserAlreadyExistsException when email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(UserAlreadyExistsException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should hash password before creating user', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      userRepository.create.mockResolvedValue(mockUser);

      await useCase.execute(mockCreateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        user_type: 'user',
      });
    });

    it('should create admin user successfully', async () => {
      const adminDto = { ...mockCreateUserDto, user_type: 'admin' };
      userRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      userRepository.create.mockResolvedValue({ ...mockUser, user_type: 'admin' });

      const result = await useCase.execute(adminDto);

      expect(result.user_type).toBe('admin');
      expect(userRepository.create).toHaveBeenCalledWith({
        ...adminDto,
        password: 'hashedPassword',
      });
    });
  });
}); 