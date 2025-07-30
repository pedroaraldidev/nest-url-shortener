import { Click } from '../entities/click.entity';

export const IClickRepository = 'IClickRepository';

export interface IClickRepository {
  create(urlId: number, ipAddress: string, userAgent?: string, referer?: string): Promise<Click>;
  countByUrlId(urlId: number): Promise<number>;
  countUniqueByUrlId(urlId: number): Promise<number>;
} 