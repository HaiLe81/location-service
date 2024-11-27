import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost | null,
    private readonly logger: Logger | null,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const traceId = ctx.getRequest().headers['x-trace-id'];
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      code: httpStatus,
      error:
        exception instanceof HttpException
          ? exception.message || null
          : 'Internal server error',
      data: (exception as any)?.response,
      traceId,
    };

    this.logger.error(
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error',
      {
        ...responseBody,
      },
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
