import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginUseCase } from './use-cases/login.usecase';

describe('AuthService', () => {
  let service: AuthService;
  let loginUseCase: jest.Mocked<LoginUseCase>;

  beforeEach(async () => {
    const mockLoginUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    loginUseCase = module.get(LoginUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
