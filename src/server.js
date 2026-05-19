require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const config = require('./config/env');
const { exiftool } = require('exiftool-vendored');

const PORT = config.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server...');
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await exiftool.end();
      logger.info('Exiftool process terminated.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown', err);
      process.exit(1);
    }
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
