const logger = require('../utils/logger');

const calculateFinalScore = (metadataAnalysis, visualAnalysis) => {
  logger.info('Calculating final score');
  
  let finalScore = 0;
  let finalVerdict = 'inconclusive';

  // 1. Evaluate Metadata (weight: 20%)
  let metadataScore = 0;
  if (metadataAnalysis.detectedAiKeywords.length > 0) {
    metadataScore = 100; // Strong indicator
  } else if (!metadataAnalysis.hasCameraMetadata) {
    metadataScore = 80; // Highly suspicious if no metadata exists in modern photos
  } else {
    metadataScore = 10; // Probably real based on metadata
  }

  let visualContribution = visualAnalysis ? visualAnalysis.ai_probability_score : 50;
  
  if (visualAnalysis) {
    if (visualAnalysis.has_illegible_text_or_garbled_small_details || visualAnalysis.has_structural_anomalies || visualAnalysis.has_melting_or_vanishing_objects || visualAnalysis.has_illegible_background_text || visualAnalysis.has_unnatural_reflections) {
      visualContribution = 100; // Override if any blatant AI artifact is found
      logger.info('Anomaly override triggered: visualContribution set to 100');
    }
  }

  // We trust visual analysis a bit more (80%), especially now that the prompt is strict.
  finalScore = (metadataScore * 0.2) + (visualContribution * 0.8);
  
  // Lower the threshold slightly to catch more AI images
  if (finalScore >= 65) {
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
    visualAnalysis: {
      ...visualAnalysis,
      likelyAiGenerated: finalScore >= 65,
      confidence: Math.round(finalScore)
    }
  };
};

module.exports = {
  calculateFinalScore
};
