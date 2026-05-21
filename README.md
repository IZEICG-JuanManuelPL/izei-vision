# MedIA (IZEI Vision)

Plataforma integral (Frontend + Backend) diseñada para la validación forense de imágenes mediante IA y la extracción inteligente de datos (OCR avanzado), con una interfaz de usuario moderna basada en Neumorfismo.

## 🚀 Características Principales

1. **Validación de IA (Forense):**
   - **Análisis de Metadatos:** Utiliza `exiftool-vendored` para detectar ausencia de datos de cámara o presencia de firmas de software generativo (Midjourney, DALL-E, etc.).
   - **Análisis Visual (GPT-4o Vision):** Inspección minuciosa de anomalías visuales (textos ininteligibles, objetos fusionados, física imposible).
   - **Perfiles de Contexto Analítico:** Permite inyectar reglas corporativas estrictas (Ej. "Los Chocorroles de Bimbo siempre vienen en pares y en empaque opaco") para una detección infalible.

2. **Extracción de Datos (OCR Estructurado):**
   - Transcripción automática de documentos (identificaciones, facturas, recibos) en formato JSON estructurado utilizando la potencia de GPT-4o.
   - Opción nativa de copia rápida al portapapeles.

3. **Interfaz Neumórfica (React + Tailwind):**
   - Diseño vanguardista "Soft UI" o Neumorfismo con paleta de colores cuidada y animaciones fluidas (`framer-motion`).

## 🏗️ Arquitectura del Proyecto

El proyecto está dividido en dos partes principales:

```text
MedIA/
├── frontend/              # Aplicación Web (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/    # Componentes UI (Neumorfismo, Dashboards)
│   │   ├── services/      # Comunicación con la API (Axios)
│   │   └── utils/         # Utilidades (Gestión de clases tailwind)
│   └── package.json       
│
├── src/                   # Servidor Backend (Node.js + Express)
│   ├── config/            # Variables de entorno
│   ├── controllers/       # Lógica de enrutamiento
│   ├── middlewares/       # Multer (subida de archivos) y manejo de errores
│   ├── routes/            # Definición de Endpoints
│   └── services/          # Lógica Core (OpenAI, ExifTool, Scoring Forense)
│
├── .env                   # Variables de entorno del backend
├── package.json           # Dependencias del backend
└── docker-compose.yml     # Orquestación con Docker
```

## ⚙️ Configuración y Despliegue

### 1. Requisitos Previos
- Node.js v18+
- Clave de API de OpenAI (GPT-4o Vision habilitado)

### 2. Configuración de Variables de Entorno
En la raíz del proyecto, copia el archivo de ejemplo y configura tu API Key:
```bash
cp .env.example .env
```
Edita `.env` para incluir:
```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=sk-tu-api-key-aqui
```

En la carpeta `frontend/`, si deseas cambiar la URL de la API:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Instalación Local
**Backend:**
```bash
# En la raíz del proyecto
npm install
npm run dev
```

**Frontend:**
```bash
# En una terminal nueva
cd frontend
npm install
npm run dev
```

La aplicación web estará disponible en `http://localhost:5173`.

### 4. Despliegue con Docker (Opcional)
Puedes levantar el backend contenedorizado:
```bash
docker-compose up --build
```

## 📡 Documentación de la API

### Endpoint: `POST /api/images/validate`

Analiza una imagen basándose en el modo y el contexto especificado.

**Headers Requeridos:**
- `Content-Type: multipart/form-data`

**Body (FormData):**
- `image` *(File, Requerido)*: Archivo de imagen (JPEG, PNG, WEBP).
- `analysisType` *(String, Opcional)*: Modo de operación.
  - `ai_validation` (Por defecto): Busca señales de generación por IA.
  - `data_extraction`: Actúa como OCR para extraer información estructurada.
- `analysisContext` *(String, Opcional)*: Inyecta reglas de negocio al análisis.
  - `general` (Por defecto): Reglas forenses estándar.
  - `bimbo_marinela`: Reglas estrictas de empaque para productos Bimbo/Marinela (México).

**Ejemplo de Petición (cURL):**
```bash
curl -X POST http://localhost:3000/api/images/validate \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/ruta/a/foto.jpg" \
  -F "analysisType=ai_validation" \
  -F "analysisContext=bimbo_marinela"
```

**Respuesta Exitosa (Modo: Validación IA):**
```json
{
  "success": true,
  "data": {
    "mode": "ai_validation",
    "finalScore": 100,
    "finalVerdict": "probable_ai_generated",
    "metadataAnalysis": {
      "hasCameraMetadata": false,
      "detectedAiKeywords": []
    },
    "visualAnalysis": {
      "has_illegible_text_or_garbled_small_details": true,
      "ai_probability_score": 100,
      "visualSignals": [
        "El texto de información nutricional es ilegible.",
        "Los Chocorroles vienen empacados en bolsa transparente y en trío, lo cual rompe las reglas corporativas."
      ],
      "explanation": "..."
    }
  },
  "meta": {
    "executionTimeMs": 3500
  }
}
```

**Respuesta Exitosa (Modo: Extracción de Datos):**
```json
{
  "success": true,
  "data": {
    "mode": "data_extraction",
    "extractedData": {
      "NOMBRE": "JUAN PEREZ",
      "FECHA_NACIMIENTO": "05/07/1996"
    }
  },
  "meta": {
    "executionTimeMs": 2800
  }
}
```
