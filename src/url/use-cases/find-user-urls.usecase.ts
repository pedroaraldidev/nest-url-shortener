import { Injectable, Inject } from '@nestjs/common';
import { IUrlRepository } from '../repositories/url.repository.interface';
import { IClickRepository } from '../repositories/click.repository.interface';
import { UrlResponseDto } from '../dto/url-response.dto';

@Injectable()
export class FindUserUrlsUseCase {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
    @Inject(IClickRepository)
    private readonly clickRepository: IClickRepository,
  ) {}

  async execute(userId: number): Promise<UrlResponseDto[]> {
    const urls = await this.urlRepository.findByUserId(userId);
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    const urlsWithClicks = await Promise.all(
      urls.map(async (url) => {
        const clickCount = await this.clickRepository.countByUrlId(url.id);
        const uniqueClickCount = await this.clickRepository.countUniqueByUrlId(url.id);
        
        return {
          id: url.id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${baseUrl}/${url.shortCode}`,
          clickCount,
          uniqueClickCount,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt,
        };
      })
    );
    
    return urlsWithClicks;
  }
} 