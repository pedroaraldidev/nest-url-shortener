import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { IUrlRepository } from '../repositories/url.repository.interface';
import { UrlOwnershipException } from '../../common/exceptions/url.exceptions';

@Injectable()
export class UrlOwnershipGuard implements CanActivate {
  constructor(@Inject(IUrlRepository) private readonly urlRepository: IUrlRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const urlId = Number(request.params.id);
    
    // Acessa sub do JWT e mapeia para id
    const userId = Number(request.user?.sub || request.user?.id);

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const url = await this.urlRepository.findById(urlId);
    if (!url) {
      throw new UrlOwnershipException('URL not found');
    }

    if (url.userId !== userId) {
      throw new UrlOwnershipException();
    }
    return true;
  }
} 