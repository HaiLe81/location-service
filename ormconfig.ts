import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { SnakeNamingStrategy } from './src/shared/typeorm/strategies/snake-naming.strategy';

dotenv.config({
  path: `.env`,
});

for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/**/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],

  extra:
    process.env.DATABASE_SSL == 'true'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
});
