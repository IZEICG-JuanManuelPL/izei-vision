import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../assets/Logo';
import { X, MapPin } from 'lucide-react';

export const AppHeader = () => {
  const [showDocs, setShowDocs] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  return (
    <>
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between glass-panel sticky top-0 z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.location.reload()}
        >
          <Logo className="w-12 h-12" />
          <span className="text-xl font-bold tracking-tight text-foreground ml-1">
            IZEI <span className="font-light text-muted-foreground">Vision</span>
          </span>
        </motion.div>
        
        <motion.nav 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground"
        >
          <button 
            onClick={() => setShowDocs(true)}
            className="hover:text-foreground transition-colors"
          >
            Documentación
          </button>
          <button 
            onClick={() => setShowSupport(true)}
            className="hover:text-foreground transition-colors"
          >
            Soporte
          </button>
        </motion.nav>
      </header>

      {/* Docs Modal */}
      <AnimatePresence>
        {showDocs && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-premium relative"
            >
              <button 
                onClick={() => setShowDocs(false)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-danger transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Logo className="w-8 h-8" /> Cómo Funciona
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>IZEI Vision</strong> utiliza un motor forense digital avanzado capaz de analizar imágenes y documentos para determinar su nivel de autenticidad.
                </p>
                <p>
                  El sistema evalúa múltiples factores de forma invisible, incluyendo:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Integridad Estructural:</strong> Revisa el rastro digital del archivo, comprobando el software utilizado para su creación o última edición.</li>
                  <li><strong>Consistencia Lumínica:</strong> Analiza sombras, reflejos y la interacción de la luz en la imagen buscando irregularidades físicas.</li>
                  <li><strong>Anomalías Sintéticas:</strong> Escanea patrones, texturas y formas en busca de artefactos visuales comunes en generaciones artificiales.</li>
                  <li><strong>Validación de Documentos:</strong> En caso de ser un documento oficial, se extraen sus datos clave y se buscan huellas de manipulación tipográfica.</li>
                </ul>
                <p className="mt-6 text-sm italic">
                  *Nota: Nuestro sistema provee probabilidades de alteración, funcionando como una herramienta de apoyo analítico avanzado.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Modal */}
      <AnimatePresence>
        {showSupport && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-premium relative text-center"
            >
              <button 
                onClick={() => setShowSupport(false)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-danger transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6">Soporte Técnico</h2>
              
              <div className="bg-muted/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-2">
                  <MapPin size={24} />
                </div>
                <h3 className="font-semibold text-foreground">Oficina Principal</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Av. Manuel Gómez Morín 955,<br />
                  Montebello, 66273<br />
                  San Pedro Garza García, N.L.
                </p>
              </div>
              
              <p className="mt-8 text-sm text-muted-foreground">
                Para consultas empresariales, por favor visita nuestras oficinas.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
