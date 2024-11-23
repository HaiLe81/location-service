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

const APP_MODULES = [];

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: AppConfigService) =>
        configService.typeOrmPostgreSqlConfig,
      inject: [AppConfigService],
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
