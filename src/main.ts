import 'source-map-support/register';

import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as cors from 'cors';
import { json, Response } from 'express';
import * as morgan from 'morgan'; // HTTP request logger
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { AppConfigService } from './shared/services/app-config.service';
import { SharedModule } from './shared/shared.module';
import rawBodyMiddleware from './shared/middlewares/raw-body.middleware';
import { setupSwagger } from './shared/swaggers/setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.setGlobalPrefix('api');

  const loggerService = app.select(SharedModule).get(Logger);
  const configService = app.select(SharedModule).get(AppConfigService);
  app.useLogger(app.get(Logger));

  app.use(
    morgan('combined', {
      stream: {
        write: (message) => {
          loggerService.log(message);
        },
      },
    }),
  );

  app.use(rawBodyMiddleware());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: false,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
      validationError: {
        target: false,
      },
      validateCustomDecorators: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get('API_VERSION') || '1',
  });

  app.use(json({ limit: '50mb' }));

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, loggerService));

  if (['development', 'staging'].includes(configService.nodeEnv)) {
    const document = setupSwagger(app, configService.swaggerConfig);

    app.use('/swagger.json', (_, res: Response) => {
      res.json(document);
    });
  }

  const port = configService.getNumber('PORT') || 3000;
  const host = configService.get('HOST') || '0.0.0.0';
  const origin = configService.get('ORIGIN') || '*';
  const corsOptions = {
    origin: origin,
    methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: origin !== '*',
    allowedHeaders:
      'Content-Type, Authorization, X-Requested-With, Accept, X-XSRF-TOKEN, secret, sentry-trace, baggage',
  };
  app.use(cors(corsOptions));

  await app.listen(port, host);

  console.log(`server running on port ${host}:${port}`);
  loggerService.warn(`server running on port ${host}:${port}`);
}
bootstrap();
//
