import { DataSource } from 'typeorm';
import 'dotenv/config';

const validDbTypes = ['mysql', 'postgres', 'sqlite'] as const;
const typeDb = (process.env.DB_TYPE?.toLowerCase() ?? 'sqlite') as (typeof validDbTypes)[number];

const config = {
  type: typeDb,
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: typeDb === 'sqlite' ? './database.sqlite' : process.env.DB_NAME, 
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/typeorm/migrations/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
};

export const AppDataSource = new DataSource(config);

export default config;
