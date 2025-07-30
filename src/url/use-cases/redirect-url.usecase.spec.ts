import { Test, TestingModule } from '@nestjs/testing';
import { RedirectUrlUseCase } from './redirect-url.usecase';
import { IUrlRepository } from '../repositories/url.repository.interface';
import { IClickRepository } from '../repositories/click.repository.interface';
import { UrlNotFoundException } from '../../common/exceptions/url.exceptions';

describe('RedirectUrlUseCase', () => {
  let useCase: RedirectUrlUseCase;
  let urlRepository: jest.Mocked<IUrlRepository>;
  let clickRepository: jest.Mocked<IClickRepository>;

  beforeEach(async () => {
    const mockUrlRepository = {
      findByShortCode: jest.fn(),
    };

    const mockClickRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectUrlUseCase,
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

    useCase = module.get<RedirectUrlUseCase>(RedirectUrlUseCase);
    urlRepository = module.get('IUrlRepository');
    clickRepository = module.get('IClickRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
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

    it('should redirect to original URL successfully', async () => {
      const shortCode = 'abc123';
      const ipAddress = '192.168.1.1';
      const userAgent = 'Mozilla/5.0';
      const referer = 'https://google.com';

      urlRepository.findByShortCode.mockResolvedValue(mockUrl);
      clickRepository.create.mockResolvedValue(undefined);

      const result = await useCase.execute(shortCode, ipAddress, userAgent, referer);

      expect(urlRepository.findByShortCode).toHaveBeenCalledWith(shortCode);
      expect(clickRepository.create).toHaveBeenCalledWith(mockUrl.id, ipAddress, userAgent, referer);
      expect(result).toBe('https://example.com');
    });

    it('should redirect without user agent and referer', async () => {
      const shortCode = 'abc123';
      const ipAddress = '192.168.1.1';

      urlRepository.findByShortCode.mockResolvedValue(mockUrl);
      clickRepository.create.mockResolvedValue(undefined);

      const result = await useCase.execute(shortCode, ipAddress);

      expect(clickRepository.create).toHaveBeenCalledWith(mockUrl.id, ipAddress, undefined, undefined);
      expect(result).toBe('https://example.com');
    });

    it('should throw UrlNotFoundException when short code not found', async () => {
      const shortCode = 'nonexistent';
      const ipAddress = '192.168.1.1';

      urlRepository.findByShortCode.mockResolvedValue(null);

      await expect(useCase.execute(shortCode, ipAddress)).rejects.toThrow(UrlNotFoundException);
      expect(urlRepository.findByShortCode).toHaveBeenCalledWith(shortCode);
      expect(clickRepository.create).not.toHaveBeenCalled();
    });

    it('should track click with all parameters', async () => {
      const shortCode = 'abc123';
      const ipAddress = '192.168.1.1';
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
      const referer = 'https://facebook.com';

      urlRepository.findByShortCode.mockResolvedValue(mockUrl);
      clickRepository.create.mockResolvedValue(undefined);

      await useCase.execute(shortCode, ipAddress, userAgent, referer);

      expect(clickRepository.create).toHaveBeenCalledWith(
        mockUrl.id,
        ipAddress,
        userAgent,
        referer
      );
    });
  });
}); 