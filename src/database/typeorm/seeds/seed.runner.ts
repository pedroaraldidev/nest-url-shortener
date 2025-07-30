import { Injectable } from '@nestjs/common';
import { UserSeed } from './user.seed';

@Injectable()
export class SeedRunner {
  constructor(private readonly userSeed: UserSeed) {}

  async run() {
    console.log('Starting seeds execution...');
    
    await this.userSeed.run();
    
    console.log('All seeds executed successfully!');
  }
} 