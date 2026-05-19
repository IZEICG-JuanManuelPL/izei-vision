const { exiftool } = require('exiftool-vendored');
const logger = require('../utils/logger');
const { AI_SOFTWARE_KEYWORDS } = require('../constants/aiKeywords');

const extractMetadata = async (filePath) => {
  try {
    logger.info('Starting metadata extraction');
    const tags = await exiftool.read(filePath);
    
    // Interesting tags: Software, CreatorTool, ProfileDescription, Make, Model
    const software = tags.Software || '';
    const creatorTool = tags.CreatorTool || '';
    const make = tags.Make || '';
    const model = tags.Model || '';
    const profileDesc = tags.ProfileDescription || '';

    // Convert all values to lowercase for checking
    const combinedData = `${software} ${creatorTool} ${make} ${model} ${profileDesc}`.toLowerCase();
    
    // Check for AI keywords
    const detectedAiKeywords = AI_SOFTWARE_KEYWORDS.filter(keyword => combinedData.includes(keyword));
    
    // Check for missing typical camera metadata (often missing in AI generated images unless spoofed)
    const hasCameraMetadata = !!(tags.Make || tags.Model || tags.ExposureTime || tags.FNumber || tags.ISO);
    
    logger.info(`Metadata extraction complete. Detected AI keywords: ${detectedAiKeywords.length}`);

    return {
      rawTags: {
        software,
        creatorTool,
        make,
        model
      },
      detectedAiKeywords,
      hasCameraMetadata,
      isMetadataSuspicious: detectedAiKeywords.length > 0 || !hasCameraMetadata
    };
  } catch (error) {
    logger.error('Error reading metadata', error);
    throw new Error('Failed to extract image metadata');
  }
};

module.exports = {
  extractMetadata
};
