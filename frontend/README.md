# MedIA Validate - Frontend

This is the official frontend for the `image-validation-service`, built with a highly polished, enterprise SaaS aesthetic.

## Tech Stack
- React 19
- Vite
- Tailwind CSS (v3 with custom configuration)
- Framer Motion (for fluid, modern animations)
- Axios (for API communication)
- Lucide React (for premium iconography)

## Features
- **Modern Minimalist UI**: Designed with light-mode glassmorphism and breathing space.
- **Fluid Animations**: Loader, hover states, and dashboard entries use Framer Motion.
- **Drag & Drop Upload**: Easy and intuitive image selection.
- **Comprehensive Dashboard**: Beautiful gauges and cards displaying AI explanations, extracted data, and metadata forensics.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Ensure you have a `.env` file in this directory with:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```
   *(Adjust the URL if your backend runs on a different port).*

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Architecture
- `src/components/`: Reusable, elegant UI components.
- `src/services/api.js`: Axios instance configured to talk to the backend.
- `src/utils/cn.js`: Utility for tailwind class merging.
- `src/index.css`: Tailwind directives and custom glassmorphism utilities.
