import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockUserService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
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
      userService.create.mockResolvedValue(mockUser);

      const result = await controller.create(mockCreateUserDto);

      expect(userService.create).toHaveBeenCalledWith(mockCreateUserDto, undefined);
      expect(result).toEqual(mockUser);
    });

    it('should create user with current user', async () => {
      const currentUser = { id: 1, email: 'admin@example.com' };
      userService.create.mockResolvedValue(mockUser);

      const result = await controller.create(mockCreateUserDto, currentUser);

      expect(userService.create).toHaveBeenCalledWith(mockCreateUserDto, currentUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    const mockUsers = [
      {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        password: 'hashedPassword1',
        user_type: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        name: 'User 2',
        email: 'user2@example.com',
        password: 'hashedPassword2',
        user_type: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    it('should return all users', async () => {
      userService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
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

    it('should return user by id', async () => {
      userService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(userService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    const mockUpdateUserDto: UpdateUserDto = {
      name: 'Updated User',
      email: 'updated@example.com',
    };

    const mockUpdatedUser = {
      id: 1,
      name: 'Updated User',
      email: 'updated@example.com',
      password: 'hashedPassword',
      user_type: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should update user successfully', async () => {
      const currentUser = { id: 1, email: 'admin@example.com' };
      userService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update('1', mockUpdateUserDto, currentUser);

      expect(userService.update).toHaveBeenCalledWith(1, mockUpdateUserDto, currentUser);
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      userService.delete.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(userService.delete).toHaveBeenCalledWith(1);
    });
  });
});
