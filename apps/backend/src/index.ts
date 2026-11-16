import { startServer } from './server.js';

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
