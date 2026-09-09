import { Controller, Get } from '@nestjs/common';
import { HealthService, type HealthPayload } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /** Versioned health — GET /api/v1/health */
  @Get()
  getHealth(): Promise<HealthPayload> {
    return this.healthService.getHealth();
  }
}
