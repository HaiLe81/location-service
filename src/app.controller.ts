import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { AppService } from './app.service';
import { PinoLogger } from 'nestjs-pino';

@Controller('/')
@ApiTags('helloworld')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: PinoLogger,
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
