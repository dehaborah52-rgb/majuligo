import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { createServer, Server as HttpServer } from 'http';
import { initSocketServer } from './socket.js';
import { authRoutes } from './routes/auth.js';
import { rideRoutes } from './routes/rides.js';
import { userRoutes } from './routes/users.js';
import { captainRoutes } from './routes/captains.js';
import { healthRoutes } from './routes/health.js';

export function buildServer(): { app: FastifyInstance; server: HttpServer } {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
  });

  // Security Headers via Helmet
  app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  });

  // CORS for Admin Portal and Mobile Web Testing
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Rate Limiting (Brute-force protection for OTP and Booking)
  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Register Routes
  app.register(healthRoutes);
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(userRoutes, { prefix: '/api/v1/users' });
  app.register(captainRoutes, { prefix: '/api/v1/captains' });
  app.register(rideRoutes, { prefix: '/api/v1/rides' });

  // Attach Socket.io to Node HTTP Server
  const server = createServer(app.server);
  initSocketServer(server);

  return { app, server };
}

export async function startServer() {
  const { app, server } = buildServer();
  const PORT = parseInt(process.env.PORT || '4000', 10);
  const HOST = process.env.HOST || '0.0.0.0';

  await app.ready();

  server.listen(PORT, HOST, () => {
    console.log(`\n🚀 MajuliGo Backend API running at http://${HOST}:${PORT}`);
    console.log(`📡 WebSocket Real-time Engine initialized.\n`);
  });
}
