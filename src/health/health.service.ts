import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

const DB_CHECK_TIMEOUT_MS = 2_000;

export interface HealthStatus {
  status: 'ok' | 'error';
  database: 'up' | 'down';
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthStatus> {
    try {
      await withTimeout(this.prisma.$queryRaw`SELECT 1`, DB_CHECK_TIMEOUT_MS);
      return { status: 'ok', database: 'up' };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.error(`Database health check failed: ${reason}`);
      return { status: 'error', database: 'down' };
    }
  }
}
