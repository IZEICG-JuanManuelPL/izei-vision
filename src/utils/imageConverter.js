const sharp = require('sharp');
const heicConvert = require('heic-convert');
const { fromPath } = require('pdf2pic');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const logger = require('./logger');

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.webp': return 'image/webp';
    case '.jpeg':
    case '.jpg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.tiff':
    case '.tif': return 'image/tiff';
    case '.bmp': return 'image/bmp';
    case '.heic': return 'image/heic';
    case '.pdf': return 'application/pdf';
    case '.raw':
    case '.cr2':
    case '.nef': return 'image/x-raw';
    default: return 'application/octet-stream';
  }
};

/**
 * Converts a given file (PDF, HEIC, TIFF, RAW, etc.) into a standard JPEG for processing.
 * Returns the path to the converted JPEG image, or the original path if no conversion is needed.
 */
const convertToStandardFormat = async (filePath) => {
  const mimeType = getMimeType(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  // Standard formats supported directly by OpenAI Vision
  if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimeType) && ext !== '.heic') {
    return filePath; // No conversion needed
  }

  logger.info(`Converting file ${filePath} from ${mimeType} to JPEG...`);
  const outputPath = path.join(os.tmpdir(), `converted-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`);

  try {
    if (mimeType === 'application/pdf') {
      // Convert first page of PDF
      const options = {
        density: 150,
        saveFilename: path.parse(outputPath).name,
        savePath: path.dirname(outputPath),
        format: "jpeg",
        width: 1024,
      };
      const storeAsImage = fromPath(filePath, options);
      const data = await storeAsImage(1); // Page 1
      return data.path;

    } else if (mimeType === 'image/heic') {
      // Convert HEIC
      const inputBuffer = await fs.readFile(filePath);
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.8
      });
      await fs.writeFile(outputPath, outputBuffer);
      return outputPath;

    } else {
      // Convert other formats using sharp (TIFF, BMP, RAW if libvips supports it)
      await sharp(filePath)
        .jpeg({ quality: 85 })
        .toFile(outputPath);
      return outputPath;
    }
  } catch (error) {
    logger.error(`Error converting file ${filePath}: ${error.message}`);
    const err = new Error(`No se pudo procesar el formato de la imagen (${ext}). Asegúrate de que el archivo no esté dañado.`);
    err.statusCode = 400;
    err.isOperational = true;
    throw err;
  }
};

module.exports = {
  convertToStandardFormat,
  getMimeType
};
