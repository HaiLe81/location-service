import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  constructor(private logger: PinoLogger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const eventId = this.extractEventId(req.headers['X-EVENT-ID']);
    const traceId = uuidv4();
    req.headers['X-TRACE-ID'] = traceId;
    this.logger.info(`Incoming request ${req.method} ${req.url}`, {
      eventId,
      traceId,
    });

    next();
  }

  private extractEventId(
    eventIdHeader: string | string[] | undefined,
  ): string | undefined {
    if (!eventIdHeader) {
      return undefined;
    }
    return Array.isArray(eventIdHeader) ? eventIdHeader[0] : eventIdHeader;
  }
}
