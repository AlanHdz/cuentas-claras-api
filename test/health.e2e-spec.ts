import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('GET /health (e2e)', () => {
  const prisma = { $queryRaw: vi.fn() };
  let app: INestApplication<App>;

  beforeEach(async () => {
    prisma.$queryRaw.mockReset();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleRef.createNestApplication({ logger: false });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 200 when the database responds', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', database: 'up' });
  });

  it('returns 503 when the database is down', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connect ECONNREFUSED'));

    await request(app.getHttpServer())
      .get('/health')
      .expect(503)
      .expect({ status: 'error', database: 'down' });
  });
});
