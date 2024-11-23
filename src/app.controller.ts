import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { AppService } from './app.service';
import { LoggerService } from './shared/services/logger.service';

@Controller('/')
@ApiTags('helloworld')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    this.logger.info('Hello World!');
    return this.appService.getHello();
  }

  @Get('healthcheck')
  @HealthCheck()
  healthCheck() {
    return { data: true };
  }
}
