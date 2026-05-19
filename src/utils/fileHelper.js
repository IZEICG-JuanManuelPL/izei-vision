const fs = require('fs');
const { promisify } = require('util');
const logger = require('./logger');

const unlinkAsync = promisify(fs.unlink);

const removeFile = async (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
      logger.debug(`Successfully removed temp file: ${filePath}`);
    }
  } catch (error) {
    logger.error(`Failed to remove file: ${filePath}`, error);
  }
};

module.exports = {
  removeFile
};
