import { env } from '@/common/utils/envConfig';
import { app } from '@/server';

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  console.log(
    '==============================================================='
  );
  console.info(
    `🚀 Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`
  );
  console.log(
    '==============================================================='
  );
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM received, shutting down server...');
  server.close(() => {
    console.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.info('SIGINT received, shutting down server...');
  server.close(() => {
    console.info('Server closed');
    process.exit(0);
  });
});
