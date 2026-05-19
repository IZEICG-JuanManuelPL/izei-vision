import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { HeroSection } from './components/HeroSection';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ResultDashboard } from './components/ResultDashboard';
import { validateImage } from './services/api';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, analyzing, success, error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      const response = await validateImage(selectedImage.file);
      setResult(response.data);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error durante el análisis.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col font-sans">
      {/* Background elegant details */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#6c3ce9]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

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
                    className="bg-[#111] text-white px-8 py-3 rounded-full font-medium hover:bg-[#6c3ce9] transition-all duration-300 transform hover:scale-105 shadow-premium"
                  >
                    Analizar Imagen
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
                  className="bg-white border border-border text-foreground px-8 py-3 rounded-full font-medium hover:bg-muted transition-all duration-300 shadow-premium"
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
