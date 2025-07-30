import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UrlController } from './url.controller';
import { CreateUrlUseCase } from './use-cases/create-url.usecase';
import { RedirectUrlUseCase } from './use-cases/redirect-url.usecase';
import { FindUserUrlsUseCase } from './use-cases/find-user-urls.usecase';
import { UpdateUrlUseCase } from './use-cases/update-url.usecase';
import { DeleteUrlUseCase } from './use-cases/delete-url.usecase';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlResponseDto } from './dto/url-response.dto';
import { IUrlRepository } from './repositories/url.repository.interface';

describe('UrlController', () => {
  let controller: UrlController;
  let createUrlUseCase: jest.Mocked<CreateUrlUseCase>;
  let redirectUrlUseCase: jest.Mocked<RedirectUrlUseCase>;
  let findUserUrlsUseCase: jest.Mocked<FindUserUrlsUseCase>;
  let updateUrlUseCase: jest.Mocked<UpdateUrlUseCase>;
  let deleteUrlUseCase: jest.Mocked<DeleteUrlUseCase>;

  beforeEach(async () => {
    const mockCreateUrlUseCase = {
      execute: jest.fn(),
    };

    const mockRedirectUrlUseCase = {
      execute: jest.fn(),
    };

    const mockFindUserUrlsUseCase = {
      execute: jest.fn(),
    };

    const mockUpdateUrlUseCase = {
      execute: jest.fn(),
    };

    const mockDeleteUrlUseCase = {
      execute: jest.fn(),
    };

    const mockUrlRepository = {
      create: jest.fn(),
      findByShortCode: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateShortCode: jest.fn(),
      isShortCodeAvailable: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: CreateUrlUseCase,
          useValue: mockCreateUrlUseCase,
        },
        {
          provide: RedirectUrlUseCase,
          useValue: mockRedirectUrlUseCase,
        },
        {
          provide: FindUserUrlsUseCase,
          useValue: mockFindUserUrlsUseCase,
        },
        {
          provide: UpdateUrlUseCase,
          useValue: mockUpdateUrlUseCase,
        },
        {
          provide: DeleteUrlUseCase,
          useValue: mockDeleteUrlUseCase,
        },
        {
          provide: IUrlRepository,
          useValue: mockUrlRepository,
        },
        {
          provide: JwtService,
          useValue: { verify: jest.fn() },
        },
        {
          provide: Reflector,
          useValue: { getAllAndOverride: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    createUrlUseCase = module.get(CreateUrlUseCase);
    redirectUrlUseCase = module.get(RedirectUrlUseCase);
    findUserUrlsUseCase = module.get(FindUserUrlsUseCase);
    updateUrlUseCase = module.get(UpdateUrlUseCase);
    deleteUrlUseCase = module.get(DeleteUrlUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shortenUrl', () => {
    const mockCreateUrlDto: CreateUrlDto = {
      originalUrl: 'https://example.com',
    };

    const mockUrlResponse: UrlResponseDto = {
      id: 1,
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
      shortUrl: 'http://localhost:3000/abc123',
      clickCount: 0,
      uniqueClickCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create shortened URL without user', async () => {
      createUrlUseCase.execute.mockResolvedValue(mockUrlResponse);

      const result = await controller.shortenUrl(mockCreateUrlDto);

      expect(createUrlUseCase.execute).toHaveBeenCalledWith(mockCreateUrlDto, undefined);
      expect(result).toEqual(mockUrlResponse);
    });

    it('should create shortened URL with user', async () => {
      const user = { id: 1, email: 'test@example.com' };
      createUrlUseCase.execute.mockResolvedValue(mockUrlResponse);

      const result = await controller.shortenUrl(mockCreateUrlDto, user);

      expect(createUrlUseCase.execute).toHaveBeenCalledWith(mockCreateUrlDto, 1);
      expect(result).toEqual(mockUrlResponse);
    });
  });

  describe('getUserUrls', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockUrls: UrlResponseDto[] = [
      {
        id: 1,
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        shortUrl: 'http://localhost:3000/abc123',
        clickCount: 5,
        uniqueClickCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return user URLs', async () => {
      findUserUrlsUseCase.execute.mockResolvedValue(mockUrls);

      const result = await controller.getUserUrls(mockUser);

      expect(findUserUrlsUseCase.execute).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUrls);
    });
  });

  describe('updateUrl', () => {
    const mockUpdateUrlDto: UpdateUrlDto = {
      originalUrl: 'https://updated.com',
    };
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockUrlResponse: UrlResponseDto = {
      id: 1,
      originalUrl: 'https://updated.com',
      shortCode: 'abc123',
      shortUrl: 'http://localhost:3000/abc123',
      clickCount: 0,
      uniqueClickCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update URL successfully', async () => {
      updateUrlUseCase.execute.mockResolvedValue(mockUrlResponse);

      const result = await controller.updateUrl(1, mockUpdateUrlDto, mockUser);

      expect(updateUrlUseCase.execute).toHaveBeenCalledWith(1, mockUpdateUrlDto, 1);
      expect(result).toEqual(mockUrlResponse);
    });
  });

  describe('deleteUrl', () => {
    const mockUser = { id: 1, email: 'test@example.com' };

    it('should delete URL successfully', async () => {
      deleteUrlUseCase.execute.mockResolvedValue(undefined);

      await controller.deleteUrl(1, mockUser);

      expect(deleteUrlUseCase.execute).toHaveBeenCalledWith(1, 1);
    });
  });
}); 