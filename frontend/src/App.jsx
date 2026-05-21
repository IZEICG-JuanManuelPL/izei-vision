import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { HeroSection } from './components/HeroSection';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ResultDashboard } from './components/ResultDashboard';
import { validateImage } from './services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils/cn';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, analyzing, success, error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [analysisType, setAnalysisType] = useState('ai_validation');
  const [analysisContext, setAnalysisContext] = useState('general');

  const handleImageSelect = (imageObj) => {
    setSelectedImage(imageObj);
    setError(null);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setStatus('analyzing');
    try {
      const response = await validateImage(selectedImage.file, analysisType, analysisContext);
      setResult(response.data);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error durante el análisis.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col font-sans">
      {/* Neumorphic background is handled via tailwind config colors */}

      <AppHeader />
      
      <main className="flex-1 relative z-10 pb-24">
        <AnimatePresence mode="wait">
          {status === 'idle' || status === 'error' ? (
            <motion.div 
              key="hero-uploader"
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <HeroSection />
              
              <div className="flex bg-background shadow-neu-pressed rounded-full p-1 mb-8 w-max">
                <button 
                  onClick={() => setAnalysisType('ai_validation')}
                  className={cn(
                    "px-6 py-2 rounded-full font-medium transition-all",
                    analysisType === 'ai_validation' ? "shadow-neu-flat text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Validación IA
                </button>
                <button 
                  onClick={() => setAnalysisType('data_extraction')}
                  className={cn(
                    "px-6 py-2 rounded-full font-medium transition-all",
                    analysisType === 'data_extraction' ? "shadow-neu-flat text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Extracción de Datos
                </button>
              </div>

              {analysisType === 'ai_validation' && (
                <div className="flex flex-col items-center mb-8 w-full max-w-sm">
                  <label className="text-sm text-muted-foreground mb-3 font-medium">Perfil de Contexto Analítico</label>
                  <div className="relative w-full">
                    <select
                      value={analysisContext}
                      onChange={(e) => setAnalysisContext(e.target.value)}
                      className="w-full appearance-none bg-background shadow-neu-pressed px-6 py-3 rounded-full text-foreground font-medium outline-none cursor-pointer text-center hover:text-primary transition-colors focus:ring-2 focus:ring-[#6c3ce9]/50"
                    >
                      <option value="general">General (Estándar)</option>
                      <option value="bimbo_marinela">Productos Bimbo / Marinela</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-primary">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              )}

              <ImageUploader 
                onImageSelect={handleImageSelect} 
                selectedImage={selectedImage} 
                onReset={handleReset}
                error={error}
              />
              
              {selectedImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <button 
                    onClick={handleAnalyze}
                    className="neu-button px-8 py-3 text-[#6c3ce9]"
                  >
                    {analysisType === 'ai_validation' ? 'Analizar Imagen' : 'Extraer Datos'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : status === 'analyzing' ? (
            <AnalysisLoader key="loader" />
          ) : status === 'success' && result ? (
            <motion.div key="dashboard" className="flex flex-col items-center pb-12">
              <ResultDashboard result={result} />
              <div className="mt-12">
                  <button 
                    onClick={handleReset}
                    className="neu-button px-8 py-3"
                  >
                    Analizar otra imagen
                  </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        <p>Desarrollado por IZEI Consulting group</p>
      </footer>
    </div>
  );
}

export default App;
