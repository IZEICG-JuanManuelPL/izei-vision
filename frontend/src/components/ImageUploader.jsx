import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export const ImageUploader = ({ onImageSelect, selectedImage, onReset, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert("Formato inválido. Por favor sube archivos JPEG, PNG o WEBP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("El archivo es muy grande. El límite es de 10MB.");
      return;
    }
    
    const previewUrl = URL.createObjectURL(file);
    onImageSelect({ file, previewUrl });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "relative rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden neu-panel",
              isDragging ? "shadow-neu-pressed bg-background border-transparent" : "hover:shadow-neu-pressed",
              error ? "border-danger bg-danger/5" : ""
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileInput}
            />
            
            <div className="w-16 h-16 bg-background shadow-neu-flat rounded-full flex items-center justify-center mb-6 text-muted-foreground group-hover:text-primary transition-colors animate-float">
              <UploadCloud size={32} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-xl font-medium text-foreground mb-2">Carga una imagen</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Arrastra y suelta tu archivo aquí, o haz clic para buscarlo. Soporta JPEG, PNG y WEBP (Máx. 10MB).
            </p>
            
            {error && (
              <p className="mt-4 text-sm text-danger font-medium bg-danger/10 px-4 py-2 rounded-lg">
                {error}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="neu-panel p-4 relative"
          >
            <button 
              onClick={onReset}
              className="absolute -top-4 -right-4 w-10 h-10 neu-button flex items-center justify-center text-muted-foreground hover:text-danger hover:scale-105 transition-all z-10"
            >
              <X size={20} />
            </button>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-background shadow-neu-pressed flex items-center justify-center">
              <img 
                src={selectedImage.previewUrl} 
                alt="Vista previa" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 px-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-background shadow-neu-flat flex items-center justify-center text-primary">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[200px] md:max-w-xs">
                    {selectedImage.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedImage.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
