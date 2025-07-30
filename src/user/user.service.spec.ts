import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { FindAllUsersUseCase } from './use-cases/find-all-users.usecase';
import { FindUserUseCase } from './use-cases/find-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';

describe('UserService', () => {
  let service: UserService;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let updateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let findAllUsersUseCase: jest.Mocked<FindAllUsersUseCase>;
  let findUserUseCase: jest.Mocked<FindUserUseCase>;
  let deleteUserUseCase: jest.Mocked<DeleteUserUseCase>;

  beforeEach(async () => {
    const mockCreateUserUseCase = { execute: jest.fn() };
    const mockUpdateUserUseCase = { execute: jest.fn() };
    const mockFindAllUsersUseCase = { execute: jest.fn() };
    const mockFindUserUseCase = { execute: jest.fn() };
    const mockDeleteUserUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: UpdateUserUseCase,
          useValue: mockUpdateUserUseCase,
        },
        {
          provide: FindAllUsersUseCase,
          useValue: mockFindAllUsersUseCase,
        },
        {
          provide: FindUserUseCase,
          useValue: mockFindUserUseCase,
        },
        {
          provide: DeleteUserUseCase,
          useValue: mockDeleteUserUseCase,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    createUserUseCase = module.get(CreateUserUseCase);
    updateUserUseCase = module.get(UpdateUserUseCase);
    findAllUsersUseCase = module.get(FindAllUsersUseCase);
    findUserUseCase = module.get(FindUserUseCase);
    deleteUserUseCase = module.get(DeleteUserUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
