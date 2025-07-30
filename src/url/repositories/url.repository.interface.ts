import { Url } from '../entities/url.entity';
import { CreateUrlDto } from '../dto/create-url.dto';
import { UpdateUrlDto } from '../dto/update-url.dto';

export const IUrlRepository = 'IUrlRepository';

export interface IUrlRepository {
  create(data: CreateUrlDto, userId?: number): Promise<Url>;
  findByShortCode(shortCode: string): Promise<Url | null>;
  findById(id: number): Promise<Url | null>;
  findByUserId(userId: number): Promise<Url[]>;
  update(id: number, data: UpdateUrlDto): Promise<Url>;
  delete(id: number): Promise<void>;
  generateShortCode(): Promise<string>;
  isShortCodeAvailable(shortCode: string): Promise<boolean>;
} 