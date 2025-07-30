import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Url } from '../../../url/entities/url.entity';
import { User } from '../../../user/entities/user.entity';

@Injectable()
export class UrlSeed {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const urlRepository = this.dataSource.getRepository(Url);
    const userRepository = this.dataSource.getRepository(User);

    const users = await userRepository.find();
    const user = users[0];

    const urlData = [
      {
        originalUrl: 'https://www.google.com',
        shortCode: 'google',
        userId: user ? user.id as number : null,
      },
      {
        originalUrl: 'https://www.github.com',
        shortCode: 'github',
        userId: user ? user.id as number : null,
      },
      {
        originalUrl: 'https://www.stackoverflow.com',
        shortCode: 'stack',
        userId: null,
      },
      {
        originalUrl: 'https://www.npmjs.com',
        shortCode: 'npmjs',
        userId: null,
      },
    ];

    for (const data of urlData) {
      const existingUrl = await urlRepository.findOne({
        where: { shortCode: data.shortCode },
      });

      if (!existingUrl) {
        const url = urlRepository.create(data);
        await urlRepository.save(url);
      }
    }
  }
} 