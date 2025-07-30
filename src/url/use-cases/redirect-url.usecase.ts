import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUrlRepository } from '../repositories/url.repository.interface';
import { IClickRepository } from '../repositories/click.repository.interface';
import { UrlNotFoundException } from '../../common/exceptions/url.exceptions';

@Injectable()
export class RedirectUrlUseCase {
  constructor(
    @Inject(IUrlRepository)
    private readonly urlRepository: IUrlRepository,
    @Inject(IClickRepository)
    private readonly clickRepository: IClickRepository,
  ) {}

  async execute(shortCode: string, ipAddress: string, userAgent?: string, referer?: string): Promise<string> {
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      throw new UrlNotFoundException();
    }
    await this.clickRepository.create(url.id, ipAddress, userAgent, referer);
    return url.originalUrl;
  }
} 