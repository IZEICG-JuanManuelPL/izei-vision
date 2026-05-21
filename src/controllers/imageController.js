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
    const analysisType = req.body.analysisType || 'ai_validation';
    const analysisContext = req.body.analysisContext || 'general';
    logger.info(`Received image for validation: ${req.file.originalname} (${req.file.size} bytes), mode: ${analysisType}, context: ${analysisContext}`);

    let finalResult;

    if (analysisType === 'data_extraction') {
      // Data Extraction Mode
      const extractionResult = await openaiService.extractData(filePath);
      finalResult = {
        mode: 'data_extraction',
        extractedData: extractionResult.extractedData || {}
      };
    } else {
      // AI Validation Mode (Default)
      // 1. Extract and analyze metadata
      const metadataAnalysis = await metadataService.extractMetadata(filePath);

      // 2. Perform visual analysis using OpenAI
      const visualAnalysis = await openaiService.analyzeImage(filePath, analysisContext);

      // 3. Calculate final hybrid score
      finalResult = scoringService.calculateFinalScore(metadataAnalysis, visualAnalysis);
      finalResult.mode = 'ai_validation';
    }

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
