import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HealthService } from './health/health.service';

async function bootstrap(): Promise<void> {
  // Immediate stdout so Railway logs show progress before Nest finishes init
  console.log(
    `[bootstrap] starting woa-api NODE_ENV=${process.env.NODE_ENV ?? ''} PORT=${process.env.PORT ?? ''}`,
  );

  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  const port = config.get<number>('port', 3001);
  const host = config.get<string>('host', '0.0.0.0');
  const corsOrigin = config.get<string>('corsOrigin', '*');
  const frontendUrl = config.get<string>('frontendUrl', 'http://localhost:5173');

  app.use(helmet());
  app.enableCors({
    origin:
      corsOrigin === '*'
        ? true
        : corsOrigin.split(',').map((value) => value.trim()).concat(frontendUrl),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Versioned routes under /api/v1; Railway health is mounted at /health below
  app.setGlobalPrefix('api/v1');

  const healthService = app.get(HealthService);
  const http = app.getHttpAdapter().getInstance();
  http.get('/health', async (_req: Request, res: Response) => {
    res.json(await healthService.getHealth());
  });

  await app.listen(port, host);
  logger.log(`woa-api listening on http://${host}:${port}`);
  logger.log(`Health: http://${host}:${port}/health`);
  logger.log(`API: http://${host}:${port}/api/v1/servers`);
}

bootstrap().catch((error) => {
  console.error('Failed to start NestJS API', error);
  process.exit(1);
});
