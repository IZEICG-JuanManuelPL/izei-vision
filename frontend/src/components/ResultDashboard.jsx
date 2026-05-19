import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, HelpCircle, FileText, Camera, Cpu, Layers } from 'lucide-react';
import { cn } from '../utils/cn';

const VerdictBadge = ({ verdict }) => {
  const map = {
    probable_ai_generated: {
      color: 'text-danger bg-danger/10 border-danger/20',
      icon: AlertTriangle,
      label: 'Probablemente generada con IA',
      gradient: 'from-danger/20 to-transparent'
    },
    probable_real: {
      color: 'text-success bg-success/10 border-success/20',
      icon: CheckCircle,
      label: 'Probablemente Auténtica',
      gradient: 'from-success/20 to-transparent'
    },
    inconclusive: {
      color: 'text-muted-foreground bg-muted border-border',
      icon: HelpCircle,
      label: 'Resultado Inconcluso',
      gradient: 'from-muted-foreground/20 to-transparent'
    }
  };

  const config = map[verdict] || map.inconclusive;
  const Icon = config.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-8 text-center border-t-4" style={{ borderTopColor: 'var(--tw-border-opacity)' }}>
      <div className={cn("absolute inset-0 bg-gradient-to-b opacity-50", config.gradient)} />
      <div className="relative z-10 flex flex-col items-center">
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", config.color)}>
          <Icon size={32} />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">{config.label}</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Basado en metadatos y análisis visual forense. Recuerda, esta es una evaluación probabilística y no una certeza absoluta.
        </p>
      </div>
    </div>
  );
};

const Gauge = ({ score, label }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="56" className="stroke-muted fill-none" strokeWidth="12" />
          <motion.circle 
            initial={{ strokeDasharray: "0 1000" }}
            animate={{ strokeDasharray: `${(score / 100) * 351} 1000` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="64" cy="64" r="56" 
            className="stroke-[#6c3ce9] fill-none" 
            strokeWidth="12" 
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-foreground text-center">{label}</span>
    </div>
  );
};

export const ResultDashboard = ({ result }) => {
  const { finalScore, finalVerdict, metadataAnalysis, visualAnalysis } = result;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto mt-12 space-y-6 px-6"
    >
      <VerdictBadge verdict={finalVerdict} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Gauge score={finalScore} label="Probabilidad de IA" />
        
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl flex flex-col justify-center">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Cpu className="text-[#6c3ce9]" size={20}/> 
            Explicación Forense
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {visualAnalysis.explanation || "No se ha provisto una explicación detallada."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Layers className="text-[#6c3ce9]" size={20}/> 
            Señales Visuales
          </h3>
          {visualAnalysis.visualSignals && visualAnalysis.visualSignals.length > 0 ? (
            <ul className="space-y-3">
              {visualAnalysis.visualSignals.map((signal, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl"
                >
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#6c3ce9] shrink-0" />
                  <span>{signal}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">No se detectaron señales visuales anómalas.</p>
          )}
        </div>

        <div className="space-y-6">
          {visualAnalysis.imageDescription && (
            <div className="glass-panel p-6 rounded-3xl">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileText className="text-[#6c3ce9]" size={20}/> 
                Descripción de Contenido
              </h3>
              <p className="text-sm text-muted-foreground">
                {visualAnalysis.imageDescription}
              </p>
            </div>
          )}

          {visualAnalysis.extractedData && Object.keys(visualAnalysis.extractedData).length > 0 && (
            <div className="glass-panel p-6 rounded-3xl">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileText className="text-[#6c3ce9]" size={20}/> 
                Datos Extraídos
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(visualAnalysis.extractedData).map(([key, value], idx) => (
                  <div key={idx} className="bg-muted/50 p-3 rounded-xl break-words">
                    <span className="text-xs text-muted-foreground block mb-1 uppercase tracking-wider">{key}</span>
                    <span className="text-sm font-medium text-foreground">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Camera className="text-[#6c3ce9]" size={20}/> 
              Metadatos
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                <span className="text-muted-foreground">Info. de Cámara</span>
                <span className="font-medium">{metadataAnalysis.hasCameraMetadata ? 'Presente' : 'Ausente'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                <span className="text-muted-foreground">Palabras Clave de IA</span>
                <span className="font-medium">
                  {metadataAnalysis.detectedAiKeywords.length > 0 
                    ? metadataAnalysis.detectedAiKeywords.join(', ') 
                    : 'Ninguna'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pb-2">
                <span className="text-muted-foreground">Software Creador</span>
                <span className="font-medium">{metadataAnalysis.rawTags.software || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
