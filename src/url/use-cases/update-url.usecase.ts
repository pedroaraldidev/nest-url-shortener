import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { IUrlRepository } from '../repositories/url.repository.interface';
import { IClickRepository } from '../repositories/click.repository.interface';
import { UpdateUrlDto } from '../dto/update-url.dto';
import { UrlResponseDto } from '../dto/url-response.dto';
import { UrlNotFoundException, UrlOwnershipException } from '../../common/exceptions/url.exceptions';

@Injectable()
export class UpdateUrlUseCase {
  constructor(
    @Inject(IUrlRepository) private readonly urlRepository: IUrlRepository,
    @Inject(IClickRepository) private readonly clickRepository: IClickRepository,
  ) {}

  async execute(id: number, data: UpdateUrlDto, userId: number): Promise<UrlResponseDto> {
    const url = await this.urlRepository.findById(id);
    if (!url) {
      throw new UrlNotFoundException();
    }
    if (url.userId !== userId) {
      throw new UrlOwnershipException('You do not have permission to edit this URL');
    }
    const updatedUrl = await this.urlRepository.update(id, data);
    const clickCount = await this.clickRepository.countByUrlId(updatedUrl.id);
    const uniqueClickCount = await this.clickRepository.countUniqueByUrlId(updatedUrl.id);
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${updatedUrl.shortCode}`;

    return {
      id: updatedUrl.id,
      originalUrl: updatedUrl.originalUrl,
      shortCode: updatedUrl.shortCode,
      shortUrl,
      clickCount,
      uniqueClickCount,
      createdAt: updatedUrl.createdAt,
      updatedAt: updatedUrl.updatedAt,
    };
  }
} 