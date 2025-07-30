import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { SeedRunner } from './seed.runner';

async function runSeeds() {
  const app = await NestFactory.create(AppModule);
  
  const seedRunner = app.get(SeedRunner);
  await seedRunner.run();
  
  await app.close();
  process.exit(0);
}

runSeeds().catch((error) => {
  console.error('Error executing seeds:', error);
  process.exit(1);
}); 