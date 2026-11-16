import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { Server as SocketIOServer } from 'socket.io';
import { config } from './config.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';
import { rideRoutes } from './routes/rides.js';
import { setupSocketServer } from './socket.js';

export async function createBackendServer() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'test' ? 'silent' : 'info',
    },
  });

  // Security Plugins
  await app.register(helmet, {
    contentSecurityPolicy: false, // Permissive for local development APIs
  });

  await app.register(cors, {
    origin: (origin, cb) => {
      // In development, allow all localhost or mobile app requests
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return cb(null, true);
      }
      cb(null, true);
    },
    credentials: true,
  });

  await app.register(sensible);

  // Register REST Routes
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(rideRoutes);

  return app;
}

export async function startServer() {
  const app = await createBackendServer();
  await app.ready();

  // Attach Socket.io to Fastify's raw HTTP server
  const io = new SocketIOServer(app.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  setupSocketServer(io);

  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    console.log(`\n🚀 MajuliGo Backend API running at http://${config.HOST}:${config.PORT}`);
    console.log(`📡 WebSocket Real-time Engine initialized.`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
