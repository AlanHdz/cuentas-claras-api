import type { MockInstance } from 'vitest';
import { HealthService } from './health.service.js';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';

describe('HealthService', () => {
  const prisma = { $queryRaw: vi.fn() };
  let service: HealthService;
  let errorSpy: MockInstance;

  beforeEach(async () => {
    prisma.$queryRaw.mockReset();
    errorSpy = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    const moduleRef = await Test.createTestingModule({
      providers: [HealthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(HealthService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('reports the database as up when SELECT 1 succeeds', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column': 1 }]);

    await expect(service.check()).resolves.toEqual({ status: 'ok', database: 'up' });

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('reports the database as down when the query fails', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connect ECONNREFUSED'));

    await expect(service.check()).resolves.toEqual({ status: 'error', database: 'down' });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('ECONNREFUSED'));
  });

  it('reports the database as down when the query hangs past the timeout', async () => {
    vi.useFakeTimers();
    prisma.$queryRaw.mockReturnValue(new Promise(() => undefined));

    const result = service.check();
    await vi.advanceTimersByTimeAsync(2_000);

    await expect(result).resolves.toEqual({ status: 'error', database: 'down' });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Timed out'));
  });
});
