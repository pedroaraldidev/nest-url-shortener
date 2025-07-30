import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ITokenRepository } from '../token.repository.interface';
import { AuthToken } from '../../entities/auth-token.entity';

@Injectable()
export class TokenTypeOrmRepository implements ITokenRepository {
  constructor(
    @InjectRepository(AuthToken)
    private readonly repository: Repository<AuthToken>,
  ) {}

  async create(token: Partial<AuthToken>): Promise<AuthToken> {
    return this.repository.save(token);
  }

  async findByUserId(user_id: number): Promise<AuthToken | null> {
    return this.repository.findOne({ where: { user_id } });
  }
}