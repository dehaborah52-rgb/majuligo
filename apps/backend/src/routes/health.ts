import { FastifyInstance } from 'fastify';
import { BRAND_NAME, BRAND_TAGLINE } from '@majuligo/shared';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return {
      status: 'ok',
      service: 'MajuliGo API Backend',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  });

  app.get('/api/v1/info', async () => {
    return {
      brand: BRAND_NAME,
      tagline: BRAND_TAGLINE,
      serviceRegion: 'Majuli, Assam, India',
      version: '0.1.0',
      activeStatus: 'Phase 1 - Architecture & Foundations Active',
    };
  });
}
