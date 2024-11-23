import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Global, Module } from '@nestjs/common';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { AppConfigService } from './services/app-config.service';
import { LoggerService } from './services/logger.service';

const providers = [...[AppConfigService, LoggerService]];

@Global()
@Module({
  providers,
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    RateLimiterModule.registerAsync({
      useFactory: async (configService: AppConfigService) => ({
        duration: configService.apiRateLimit.DURATION,
        points: configService.apiRateLimit.POINTS,
      }),
      inject: [AppConfigService],
    }),
  ],
  exports: [...providers, AutomapperModule, RateLimiterModule],
})
export class SharedModule {}
