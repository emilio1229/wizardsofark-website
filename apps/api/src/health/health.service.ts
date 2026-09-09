import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export type HealthPayload = {
  status: 'ok' | 'degraded';
  database: 'up' | 'down';
  uptime: number;
};

@Injectable()
export class HealthService {
  private readonly startedAt = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<HealthPayload> {
    const databaseUp = await this.prisma.isHealthy();
    return {
      status: databaseUp ? 'ok' : 'degraded',
      database: databaseUp ? 'up' : 'down',
      uptime: Math.floor((Date.now() - this.startedAt) / 1000),
    };
  }
}
