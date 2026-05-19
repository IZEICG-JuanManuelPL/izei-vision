const logger = require('../utils/logger');

const calculateFinalScore = (metadataAnalysis, visualAnalysis) => {
  logger.info('Calculating final score');
  
  let finalScore = 0;
  let finalVerdict = 'inconclusive';

  // 1. Evaluate Metadata (weight: 30%)
  let metadataScore = 0;
  if (metadataAnalysis.detectedAiKeywords.length > 0) {
    metadataScore = 100; // Strong indicator
  } else if (!metadataAnalysis.hasCameraMetadata) {
    metadataScore = 60; // Suspicious but not definitive
  } else {
    metadataScore = 10; // Probably real based on metadata
  }

  // 2. Evaluate Visual Analysis from OpenAI (weight: 70%)
  let aiScore = visualAnalysis ? visualAnalysis.confidence : 50;
  let aiThinksGenerated = visualAnalysis ? visualAnalysis.likelyAiGenerated : false;

  // Hybrid logic
  // If OpenAI says it's real, invert the confidence for the 'AI generated' score
  let visualContribution = aiThinksGenerated ? aiScore : (100 - aiScore);

  finalScore = (metadataScore * 0.3) + (visualContribution * 0.7);
  
  if (finalScore >= 70) {
    finalVerdict = 'probable_ai_generated';
  } else if (finalScore <= 35) {
    finalVerdict = 'probable_real';
  } else {
    finalVerdict = 'inconclusive';
  }

  logger.info(`Score calculated: ${finalScore.toFixed(2)} - Verdict: ${finalVerdict}`);

  return {
    finalScore: Math.round(finalScore),
    finalVerdict,
    metadataAnalysis,
    visualAnalysis
  };
};

module.exports = {
  calculateFinalScore
};
