import { Test, TestingModule } from '@nestjs/testing';
import { CreateUrlUseCase } from './create-url.usecase';
import { IUrlRepository } from '../repositories/url.repository.interface';
import { IClickRepository } from '../repositories/click.repository.interface';
import { CreateUrlDto } from '../dto/create-url.dto';
import { InvalidShortCodeException, ShortCodeAlreadyExistsException } from '../../common/exceptions/url.exceptions';

describe('CreateUrlUseCase', () => {
  let useCase: CreateUrlUseCase;
  let urlRepository: jest.Mocked<IUrlRepository>;
  let clickRepository: jest.Mocked<IClickRepository>;

  beforeEach(async () => {
    const mockUrlRepository = {
      create: jest.fn(),
      isShortCodeAvailable: jest.fn(),
    };

    const mockClickRepository = {
      countByUrlId: jest.fn(),
      countUniqueByUrlId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUrlUseCase,
        {
          provide: 'IUrlRepository',
          useValue: mockUrlRepository,
        },
        {
          provide: 'IClickRepository',
          useValue: mockClickRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUrlUseCase>(CreateUrlUseCase);
    urlRepository = module.get('IUrlRepository');
    clickRepository = module.get('IClickRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const mockCreateUrlDto: CreateUrlDto = {
      originalUrl: 'https://example.com',
    };

    const mockUrl = {
      id: 1,
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      user: null,
      clicks: [],
    };

    it('should create a URL successfully without custom code', async () => {
      urlRepository.create.mockResolvedValue(mockUrl);
      clickRepository.countByUrlId.mockResolvedValue(0);
      clickRepository.countUniqueByUrlId.mockResolvedValue(0);

      const result = await useCase.execute(mockCreateUrlDto);

      expect(urlRepository.create).toHaveBeenCalledWith(mockCreateUrlDto, undefined);
      expect(result).toEqual({
        id: mockUrl.id,
        originalUrl: mockUrl.originalUrl,
        shortCode: mockUrl.shortCode,
        shortUrl: 'http://localhost:3000/abc123',
        clickCount: 0,
        uniqueClickCount: 0,
        createdAt: mockUrl.createdAt,
        updatedAt: mockUrl.updatedAt,
      });
    });

    it('should create a URL successfully with custom code', async () => {
      const customCodeDto = { ...mockCreateUrlDto, customCode: 'custom' };
      urlRepository.isShortCodeAvailable.mockResolvedValue(true);
      urlRepository.create.mockResolvedValue(mockUrl);
      clickRepository.countByUrlId.mockResolvedValue(0);
      clickRepository.countUniqueByUrlId.mockResolvedValue(0);

      const result = await useCase.execute(customCodeDto);

      expect(urlRepository.isShortCodeAvailable).toHaveBeenCalledWith('custom');
      expect(urlRepository.create).toHaveBeenCalledWith(customCodeDto, undefined);
      expect(result.shortCode).toBe('abc123');
    });

    it('should create a URL with user ID', async () => {
      const userId = 1;
      urlRepository.create.mockResolvedValue(mockUrl);
      clickRepository.countByUrlId.mockResolvedValue(0);
      clickRepository.countUniqueByUrlId.mockResolvedValue(0);

      await useCase.execute(mockCreateUrlDto, userId);

      expect(urlRepository.create).toHaveBeenCalledWith(mockCreateUrlDto, userId);
    });

    it('should throw InvalidShortCodeException when custom code is too long', async () => {
      const longCustomCodeDto = { ...mockCreateUrlDto, customCode: 'toolongcode' };

      await expect(useCase.execute(longCustomCodeDto)).rejects.toThrow(InvalidShortCodeException);
    });

    it('should throw ShortCodeAlreadyExistsException when custom code already exists', async () => {
      const customCodeDto = { ...mockCreateUrlDto, customCode: 'exist' };
      urlRepository.isShortCodeAvailable.mockResolvedValue(false);

      await expect(useCase.execute(customCodeDto)).rejects.toThrow(ShortCodeAlreadyExistsException);
    });

    it('should return correct click counts', async () => {
      urlRepository.create.mockResolvedValue(mockUrl);
      clickRepository.countByUrlId.mockResolvedValue(10);
      clickRepository.countUniqueByUrlId.mockResolvedValue(5);

      const result = await useCase.execute(mockCreateUrlDto);

      expect(result.clickCount).toBe(10);
      expect(result.uniqueClickCount).toBe(5);
    });
  });
}); 