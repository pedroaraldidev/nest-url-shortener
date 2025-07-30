import { Injectable } from '@nestjs/common';
import { LoginUseCase } from './use-cases/login.usecase';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) {}

  async login(credentials: LoginDto): Promise<TokenResponseDto> {
    return this.loginUseCase.execute(credentials);
  }
}