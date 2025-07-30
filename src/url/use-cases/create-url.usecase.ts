import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUrlRepository } from '../repositories/url.repository.interface';
import { IClickRepository } from '../repositories/click.repository.interface';
import { CreateUrlDto } from '../dto/create-url.dto';
import { UrlResponseDto } from '../dto/url-response.dto';
import { InvalidShortCodeException, ShortCodeAlreadyExistsException } from '../../common/exceptions/url.exceptions';

@Injectable()
export class CreateUrlUseCase {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
    @Inject(IClickRepository)
    private readonly clickRepository: IClickRepository,
  ) {}

  async execute(data: CreateUrlDto, userId?: number): Promise<UrlResponseDto> {
    if (data.customCode) {
      if (data.customCode.length > 6) {
        throw new InvalidShortCodeException('Custom code must have a maximum of 6 characters');
      }
      const isAvailable = await this.urlRepository.isShortCodeAvailable(data.customCode);
      if (!isAvailable) {
        throw new ShortCodeAlreadyExistsException();
      }
    }
    const url = await this.urlRepository.create(data, userId);
    const clickCount = await this.clickRepository.countByUrlId(url.id);
    const uniqueClickCount = await this.clickRepository.countUniqueByUrlId(url.id);
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${url.shortCode}`;
    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl,
      clickCount,
      uniqueClickCount,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }
} 