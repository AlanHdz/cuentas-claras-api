import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService, type HealthStatus } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  async check(): Promise<HealthStatus> {
    const result = await this.health.check();

    if (result.database === 'down') {
      throw new ServiceUnavailableException(result);
    }

    return result;
  }
}
