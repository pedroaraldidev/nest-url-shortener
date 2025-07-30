import { AuthToken } from '../entities/auth-token.entity';

export const ITokenRepository = Symbol('ITokenRepository');

export interface ITokenRepository {
  create(token: Partial<AuthToken>): Promise<AuthToken>;
  findByUserId(user_id: number): Promise<AuthToken | null>;
}