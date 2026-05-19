const metadataService = require('../services/metadataService');
const openaiService = require('../services/openaiService');
const scoringService = require('../services/scoringService');
const fileHelper = require('../utils/fileHelper');
const logger = require('../utils/logger');

const validateImage = async (req, res, next) => {
  let filePath = null;
  const startTime = Date.now();

  try {
    if (!req.file) {
      const err = new Error('No image file provided');
      err.statusCode = 400;
      err.isOperational = true;
      throw err;
    }

    filePath = req.file.path;
    logger.info(`Received image for validation: ${req.file.originalname} (${req.file.size} bytes)`);

    // 1. Extract and analyze metadata
    const metadataAnalysis = await metadataService.extractMetadata(filePath);

    // 2. Perform visual analysis using OpenAI
    const visualAnalysis = await openaiService.analyzeImage(filePath);

    // 3. Calculate final hybrid score
    const finalResult = scoringService.calculateFinalScore(metadataAnalysis, visualAnalysis);

    const executionTimeMs = Date.now() - startTime;
    logger.info(`Validation completed in ${executionTimeMs}ms`);

    res.status(200).json({
      success: true,
      data: finalResult,
      meta: {
        executionTimeMs
      }
    });

  } catch (error) {
    next(error);
  } finally {
    // Clean up temp file
    if (filePath) {
      await fileHelper.removeFile(filePath);
    }
  }
};

module.exports = {
  validateImage
};
