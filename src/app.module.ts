import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './shared/services/app-config.service';
import { SharedModule } from './shared/shared.module';
import { AppLoggerMiddleware } from './shared/middlewares/app.logger.middleware';
import { LocationModule } from './modules/location/location.module';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
// import pino from 'pino';

const APP_MODULES = [LocationModule];

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: AppConfigService) =>
        configService.typeOrmPostgreSqlConfig,
      inject: [AppConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'add some name to every JSON line',
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: {
          target: 'pino-roll',
          options: {
            file: join('logs', 'log'),
            frequency: 'daily',
            mkdir: true,
            dateFormat: 'yyyy-MM-dd',
          },
        },
      },
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    SharedModule,
    ...APP_MODULES,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
