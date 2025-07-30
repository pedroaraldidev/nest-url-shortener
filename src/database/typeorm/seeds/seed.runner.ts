import { Injectable } from '@nestjs/common';
import { UserSeed } from './user.seed';
import { UrlSeed } from './url.seed';

@Injectable()
export class SeedRunner {
  constructor(
    private readonly userSeed: UserSeed,
    private readonly urlSeed: UrlSeed,
  ) {}

  async run() {
    console.log('Starting seeds execution...');
    
    await this.userSeed.run();
    await this.urlSeed.run();
    
    console.log('All seeds executed successfully!');
  }
} 