import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { IUserRepository } from '../../user/repositories/user.repository.interface';
import { InvalidCredentialsException } from '../../common/exceptions/user.exceptions';


@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto) {
    const user = await this.userRepository.findByEmail(loginDto.email);
    
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new InvalidCredentialsException('Invalid email or password');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      user_type: user.user_type,
      name: user.name
    };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}