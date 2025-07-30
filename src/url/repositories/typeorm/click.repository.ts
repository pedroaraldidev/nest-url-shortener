import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Click } from '../../entities/click.entity';
import { IClickRepository } from '../click.repository.interface';

@Injectable()
export class ClickRepository implements IClickRepository {
  constructor(
    @InjectRepository(Click)
    private readonly clickRepository: Repository<Click>,
  ) {}

  async create(urlId: number, ipAddress: string, userAgent?: string, referer?: string): Promise<Click> {
    const click = this.clickRepository.create({
      urlId,
      ipAddress,
      userAgent,
      referer,
    });

    return this.clickRepository.save(click);
  }

  async countByUrlId(urlId: number): Promise<number> {
    return this.clickRepository.count({
      where: { urlId },
    });
  }

  async countUniqueByUrlId(urlId: number): Promise<number> {
    const result = await this.clickRepository
      .createQueryBuilder('click')
      .select('COUNT(DISTINCT click.ipAddress)', 'uniqueCount')
      .where('click.urlId = :urlId', { urlId })
      .getRawOne();
    
    return parseInt(result.uniqueCount) || 0;
  }
} 