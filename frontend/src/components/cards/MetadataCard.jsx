import React from 'react';
import { Camera, AlertTriangle } from 'lucide-react';

export const MetadataCard = ({ metadata }) => {
  if (!metadata) return null;

  const { rawTags, detectedAiKeywords, hasCameraMetadata, isMetadataSuspicious } = metadata;

  const getDisplayValue = (val) => {
    return val && val.trim() !== '' ? val : '—';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Metadata (EXIF)
          </h3>
        </div>
        {isMetadataSuspicious && (
          <span className="flex items-center text-xs font-medium text-danger bg-danger-light px-2 py-1 rounded-md">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Sospechoso
          </span>
        )}
      </div>

      <div className="space-y-3 mt-4">
        <div className="grid grid-cols-2 gap-2 text-sm border-b border-border/50 pb-2">
          <span className="text-muted-foreground">Software:</span>
          <span className="font-mono text-foreground text-right truncate" title={rawTags?.software}>{getDisplayValue(rawTags?.software)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm border-b border-border/50 pb-2">
          <span className="text-muted-foreground">Herramienta Creador:</span>
          <span className="font-mono text-foreground text-right truncate" title={rawTags?.creatorTool}>{getDisplayValue(rawTags?.creatorTool)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm border-b border-border/50 pb-2">
          <span className="text-muted-foreground">Fabricante Cámara:</span>
          <span className="font-mono text-foreground text-right truncate" title={rawTags?.make}>{getDisplayValue(rawTags?.make)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm pb-2">
          <span className="text-muted-foreground">Modelo Cámara:</span>
          <span className="font-mono text-foreground text-right truncate" title={rawTags?.model}>{getDisplayValue(rawTags?.model)}</span>
        </div>
      </div>

      {!hasCameraMetadata && (
        <div className="mt-4 text-xs text-warning bg-warning-light/50 p-2 rounded border border-warning/20">
          Ausencia de metadata típica de cámara. Común en imágenes generadas por IA.
        </div>
      )}

      {detectedAiKeywords && detectedAiKeywords.length > 0 && (
        <div className="mt-2 text-xs text-danger bg-danger-light/50 p-2 rounded border border-danger/20">
          Palabras clave IA detectadas: {detectedAiKeywords.join(', ')}
        </div>
      )}
    </div>
  );
};
