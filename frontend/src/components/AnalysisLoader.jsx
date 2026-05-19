import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../assets/Logo';

const MESSAGES = [
  "Extrayendo metadatos profundos...",
  "Ejecutando análisis forense visual...",
  "Evaluando consistencia de luz y sombra...",
  "Detectando patrones sintéticos...",
  "Calculando probabilidad final...",
  "Generando reporte de autenticidad..."
];

export const AnalysisLoader = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl mx-auto mt-8 glass-panel p-8 rounded-3xl text-center"
    >
      <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-[#6c3ce9]/20 rounded-full"></div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-[#6c3ce9] border-t-transparent rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
          <Logo className="w-10 h-10" />
        </div>
      </div>
      
      <h3 className="text-xl font-medium text-foreground mb-4">Analizando Imagen</h3>
      
      <div className="h-6 overflow-hidden">
        <motion.p 
          key={messageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-sm text-muted-foreground"
        >
          {MESSAGES[messageIndex]}
        </motion.p>
      </div>

      <div className="w-full bg-muted h-2 rounded-full mt-6 overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 10, ease: "linear" }}
          className="h-full bg-[#6c3ce9]"
        />
      </div>
    </motion.div>
  );
};
