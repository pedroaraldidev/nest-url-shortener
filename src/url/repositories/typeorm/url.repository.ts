import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../../entities/url.entity';
import { IUrlRepository } from '../url.repository.interface';
import { CreateUrlDto } from '../../dto/create-url.dto';
import { UpdateUrlDto } from '../../dto/update-url.dto';

@Injectable()
export class UrlRepository implements IUrlRepository {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async create(data: CreateUrlDto, userId?: number): Promise<Url> {
    const url = this.urlRepository.create({
      originalUrl: data.originalUrl,
      shortCode: data.customCode || await this.generateShortCode(),
      userId,
    });

    return this.urlRepository.save(url);
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.urlRepository.findOne({
      where: { shortCode, deletedAt: null },
    });
  }

  async findById(id: number): Promise<Url | null> {
    return this.urlRepository.findOne({
      where: { id, deletedAt: null },
    });
  }

  async findByUserId(userId: number): Promise<Url[]> {
    return this.urlRepository.find({
      where: { userId, deletedAt: null },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, data: UpdateUrlDto): Promise<Url> {
    await this.urlRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.urlRepository.softDelete(id);
  }

  async generateShortCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode: string;
    let isAvailable = false;

    do {
      shortCode = '';
      for (let i = 0; i < 6; i++) {
        shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      isAvailable = await this.isShortCodeAvailable(shortCode);
    } while (!isAvailable);

    return shortCode;
  }

  async isShortCodeAvailable(shortCode: string): Promise<boolean> {
    const existingUrl = await this.urlRepository.findOne({
      where: { shortCode, deletedAt: null },
    });
    return !existingUrl;
  }
} 