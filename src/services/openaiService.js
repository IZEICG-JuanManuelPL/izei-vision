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

const analyzeImage = async (filePath, analysisContext = 'general') => {
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
    
    const contextPrompts = {
      general: "You are an expert digital forensics analyst. You must evaluate the probability that the image is AI-generated on a scale from 0 to 100. Actively hunt for flaws: 1. Illegible, garbled, or alien-like text, ESPECIALLY in small details like nutrition facts, tiny labels, or background signs. 2. Distorted logos. 3. Objects melting into each other or vanishing into the background (e.g., edges of packaging disappearing). 4. Illogical reflections. 5. Structural impossibilities. If you spot EVEN ONE of these anomalies, the probability score MUST be above 75. NEVER give the image the benefit of the doubt. IMPORTANT: Respond with a structured JSON object. The JSON keys MUST be in English, but the text values MUST be written in Spanish.",
      bimbo_marinela: "CONTEXT WARNING: You are analyzing Bimbo/Marinela (Mexico) products. UNBREAKABLE RULES: 1. 'Chocorroles' ALWAYS come in opaque orange/brown packaging, NEVER in transparent bags. 2. Regular Chocorroles ALWAYS come in pairs (2 pieces), NEVER in 3 pieces. 3. 'Pingüinos' come in dark blue/black packaging. 4. If the image breaks ANY of these corporate rules, IT IS DEFINITIVELY AI-GENERATED (assign a 100% ai_probability_score) and explain why in 'explanation'. You must also evaluate standard flaws: 1. Illegible, garbled, or alien-like text, ESPECIALLY in small details like nutrition facts. 2. Distorted logos. 3. Objects melting into each other. If you spot EVEN ONE anomaly, the probability score MUST be above 75. IMPORTANT: Respond with a structured JSON object. The JSON keys MUST be in English, but the text values MUST be written in Spanish."
    };

    const systemPrompt = contextPrompts[analysisContext] || contextPrompts.general;
    logger.info(`Using context prompt: ${analysisContext}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image and identify any visual signals of AI generation. Keep JSON keys in English and text values in Spanish. Return a JSON object with this structure: { \"has_illegible_text_or_garbled_small_details\": boolean, \"has_melting_or_vanishing_objects\": boolean, \"has_structural_anomalies\": boolean, \"ai_probability_score\": number (0-100), \"visualSignals\": string[], \"explanation\": string, \"imageDescription\": string }" },
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
      max_tokens: 4096,
    });

    const result = JSON.parse(response.choices[0].message.content);
    logger.info(`OpenAI analysis complete. Probability: ${result.ai_probability_score}%`);
    return result;
    
  } catch (error) {
    logger.error('Error during OpenAI analysis', error);
    throw new Error('Failed to analyze image using AI');
  }
};

const extractData = async (filePath) => {
  try {
    logger.info('Starting OpenAI data extraction');
    
    if (!config.OPENAI_API_KEY || config.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('OpenAI API key missing or invalid.');
    }

    const base64Image = encodeImage(filePath);
    const mimeType = getMimeType(filePath);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "You are an expert data extractor and OCR system. Your sole task is to transcribe and extract all relevant information from the provided document image (such as invoices, IDs, tickets, or official papers). Do not evaluate if the image is AI-generated. Return a structured JSON object where the keys are in English (representing the field name) and the values are in Spanish (representing the extracted text). If the image is not a document or contains no text, return an empty object or a descriptive message in an 'error' key. Format: { \"extractedData\": { \"key1\": \"value1\", ... } }"
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all textual data from this document image and return it as a JSON object inside 'extractedData'." },
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
      max_tokens: 16000,
    });

    const result = JSON.parse(response.choices[0].message.content);
    logger.info(`OpenAI data extraction complete.`);
    return result;
    
  } catch (error) {
    logger.error('Error during OpenAI data extraction', error);
    throw new Error('Failed to extract data using AI');
  }
};

module.exports = {
  analyzeImage,
  extractData
};
