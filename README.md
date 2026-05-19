# Image Validation Service

Enterprise backend service to validate if an image was likely generated or manipulated by AI.

## Features
- **Metadata Forensics**: Uses `exiftool-vendored` to check for suspicious metadata and known AI generator fingerprints.
- **Visual AI Analysis**: Leverages OpenAI Vision (`gpt-4o`) to detect typical visual anomalies associated with AI generation (e.g., deformed hands, synthetic patterns).
- **Hybrid Scoring**: Combines metadata analysis and visual analysis to provide a final probabilistic score (`probable_ai_generated`, `probable_real`, `inconclusive`).
- **Production Ready**: Built with Express, robust error handling, detailed Winston logging, security headers (Helmet, CORS), and temporary file cleanup.
- **Dockerized**: Easy to deploy with Docker and `docker-compose`.

## Architecture
```text
src/
├── app.js                 # Express application setup
├── server.js              # Entry point
├── config/                # Environment configuration
├── constants/             # Shared constants (AI keywords)
├── controllers/           # Route controllers
├── middlewares/           # Custom middlewares (upload, error handling)
├── routes/                # API route definitions
├── services/              # Core business logic (Metadata, OpenAI, Scoring)
├── utils/                 # Utilities (Logger, File cleanup)
└── validations/           # (Reserved for additional request validation)
```

## Installation

### Using Docker (Recommended)
1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   *Make sure to add your `OPENAI_API_KEY`.*
3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

### Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### `POST /api/images/validate`

Validates an image.

**Headers:**
- `Content-Type: multipart/form-data`

**Body:**
- `image`: The image file to analyze (JPEG, PNG, WEBP).

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/images/validate \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/your/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "finalScore": 85,
    "finalVerdict": "probable_ai_generated",
    "metadataAnalysis": {
      "rawTags": {
        "software": "Midjourney",
        "creatorTool": "",
        "make": "",
        "model": ""
      },
      "detectedAiKeywords": ["midjourney"],
      "hasCameraMetadata": false,
      "isMetadataSuspicious": true
    },
    "visualAnalysis": {
      "likelyAiGenerated": true,
      "confidence": 90,
      "verdict": "probable_ai_generated",
      "visualSignals": [
        "Inconsistent lighting on the subject's face",
        "Unnatural texture on the background wall"
      ],
      "explanation": "The image exhibits several hallmarks of AI generation..."
    }
  },
  "meta": {
    "executionTimeMs": 2345
  }
}
```

## Future Extensions
- Queue processing for asynchronous analysis of large batches.
- Integration with AWS S3 for persistent storage of analyzed images.
- Additional forensics models (e.g., error level analysis).
# izei-vision
