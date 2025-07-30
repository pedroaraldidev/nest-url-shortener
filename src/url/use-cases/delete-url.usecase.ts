import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { IUrlRepository } from '../repositories/url.repository.interface';
import { UrlNotFoundException, UrlOwnershipException } from '../../common/exceptions/url.exceptions';

@Injectable()
export class DeleteUrlUseCase {
  constructor(@Inject(IUrlRepository) private readonly urlRepository: IUrlRepository) {}

  async execute(id: number, userId: number): Promise<void> {
    const url = await this.urlRepository.findById(id);
    if (!url) {
      throw new UrlNotFoundException();
    }
    if (url.userId !== userId) {
      throw new UrlOwnershipException('You do not have permission to delete this URL');
    }
    await this.urlRepository.delete(id);
  }
} 