import { Injectable } from '@nestjs/common';
import { UserService } from '../../../user/user.service';

@Injectable()
export class UserSeed {
  constructor(private readonly userService: UserService) {}

  async run() {
    try {
      await this.userService.create({
        name: 'Admin',
        email: 'admin@admin.com',
        password: '123456',
        user_type: 'admin'
      });
      console.log('Admin user created successfully!');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('Admin user already exists');
      } else {
        console.error('Error creating admin user:', error.message);
      }
    }
  }
} 