import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { SnakeNamingStrategy } from '../typeorm/strategies/snake-naming.strategy';
import { ISwaggerConfigInterface } from '../interfaces/swagger-config.interface';

@Injectable()
export class AppConfigService {
  constructor() {
    dotenv.config({
      path: `.env`,
    });

    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
    if (this.nodeEnv === 'development') {
      console.info(process.env);
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  public getBoolean(key: string): boolean {
    return Boolean(this.get(key) == 'true');
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get autoMigration(): boolean {
    return this.getBoolean('AUTO_MIGRATION') || false;
  }

  get swaggerConfig(): ISwaggerConfigInterface {
    return {
      path: this.get('SWAGGER_PATH') || '',
      title: this.get('SWAGGER_TITLE') || 'LOCATION API',
      description: this.get('SWAGGER_DESCRIPTION'),
      version: this.get('SWAGGER_VERSION') || '0.0.1',
      scheme: this.get('SWAGGER_SCHEME') === 'https' ? 'https' : 'http',
      host: this.get('SWAGGER_HOST') || 'localhost',
      port: this.getNumber('SWAGGER_PORT') || 3000,
    };
  }

  get typeOrmPostgreSqlConfig(): TypeOrmModuleOptions {
    let entities = [
      __dirname + '/../../modules/**/*.entity{.ts,.js}',
      __dirname + '/../../common/**/*.entity{.ts,.js}',
    ];
    let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

    if ((module as any).hot) {
      const entityContext = (require as any).context(
        './../../modules',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });
      const migrationContext = (require as any).context(
        './../../migrations',
        false,
        /\.ts$/,
      );
      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext(id);
        const [migration] = Object.values(migrationModule);
        return migration;
      });
    }

    return {
      entities,
      migrations,
      subscribers: [],
      type: 'postgres',
      host: this.get('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      username: this.get('DATABASE_USERNAME'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_NAME'),
      extra: {
        ...(this.get('DATABASE_SSL')?.toString() !== 'false'
          ? {
              ssl: {
                rejectUnauthorized: false,
              },
            }
          : {}),
        max: 200,
      },
      poolSize: 200,
      migrationsRun: this.autoMigration,
      logging:
        this.nodeEnv === 'development' && this.getBoolean('DATABASE_LOGGING'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get typeOrmPostgreSqlTestConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../../modules/**/*.public.entity{.ts,.js}',
      __dirname + '/../../common/**/*.public.entity{.ts,.js}',
      __dirname + '/../../modules/**/*.tenancy.entity{.ts,.js}',
    ];
    const migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      subscribers: [],
      type: 'postgres',
      host: this.get('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      username: this.get('DATABASE_USERNAME'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_NAME'),
      extra:
        this.get('DATABASE_SSL')?.toString() !== 'false'
          ? {
              ssl: {
                rejectUnauthorized: false,
              },
            }
          : {},
      migrationsRun: false,
      logging: this.nodeEnv === 'development',
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get cron() {
    return Number.parseInt(this.get('CRON'));
  }

  get enableSeeding() {
    return this.get('ENABLE_SEEDING') === 'true';
  }

  get jwtConfig() {
    return {
      appSecret: this.get('APP_SECRET'),
      expire: this.get('JWT_EXPIRE') || '24h',
      refreshExpire: this.get('JWT_REFRESH_EXPIRE') || '30d',
    };
  }

  get dataProvider() {
    return {
      apiUrl: this.get('DATA_PROVIDER_API_URL'),
      authKey: this.get('DATA_PROVIDER_AUTH_KEY'),
    };
  }

  get apiRateLimit() {
    return {
      POINTS: +(this.get('API_CALL_RATE_LIMIT_POINTS') ?? 5),
      DURATION: +(this.get('API_CALL_RATE_LIMIT_DURATION') ?? 60),
    };
  }

  get userRateLimit() {
    return {
      POINTS: +(this.get('USER_RATE_LIMIT_POINTS') ?? 5),
      DURATION: +(this.get('USER_RATE_LIMIT_DURATION') ?? 60),
      NAME: this.get('USER_RATE_LIMIT_NAME'),
    };
  }
}
