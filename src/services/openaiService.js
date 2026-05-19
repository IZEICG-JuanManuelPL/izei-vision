const OpenAI = require('openai');
const fs = require('fs');
const config = require('../config/env');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

// Helper to encode file to base64
const encodeImage = (filePath) => {
  return fs.readFileSync(filePath, { encoding: 'base64' });
};

// Helper to get mime type from extension
const getMimeType = (filePath) => {
  if (filePath.toLowerCase().endsWith('.png')) return 'image/png';
  if (filePath.toLowerCase().endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
};

const analyzeImage = async (filePath) => {
  try {
    logger.info('Starting OpenAI visual analysis');
    
    if (!config.OPENAI_API_KEY || config.OPENAI_API_KEY === 'your_openai_api_key_here') {
      logger.warn('OpenAI API key missing or invalid. Skipping visual analysis.');
      return {
        likelyAiGenerated: false,
        confidence: 0,
        verdict: 'inconclusive',
        visualSignals: [],
        explanation: 'OpenAI API key is missing. Visual analysis skipped.'
      };
    }

    const base64Image = encodeImage(filePath);
    const mimeType = getMimeType(filePath);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert digital forensics analyst and data extractor. Your task is twofold: 1) Analyze images to determine if they are likely generated or manipulated by AI (look for deformed hands, illegible text, inconsistent shadows, synthetic patterns, manipulation in official documents, etc.). 2) Provide a detailed description of the image content. If the image is a document (like an ID, invoice, or official paper), extract all the relevant data contained in it as key-value pairs. IMPORTANT: Respond with a structured JSON object. The JSON keys MUST be in English, but the text values (explanations, descriptions, extracted data, visual signals) MUST be written in Spanish."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image, identify any visual signals of AI generation or manipulation, describe it, and extract data if it is a document. Keep JSON keys in English and all text values in Spanish. Return a JSON object with the following structure: { \"likelyAiGenerated\": boolean, \"confidence\": number (0-100), \"verdict\": \"probable_ai_generated\" | \"probable_real\" | \"inconclusive\", \"visualSignals\": string[], \"explanation\": string, \"imageDescription\": string, \"extractedData\": object }" },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content);
    logger.info(`OpenAI analysis complete. Confidence: ${result.confidence}%`);
    return result;
    
  } catch (error) {
    logger.error('Error during OpenAI analysis', error);
    throw new Error('Failed to analyze image using AI');
  }
};

module.exports = {
  analyzeImage
};
