import React from 'react';
import { cn } from '../utils/cn';

export const AnalysisListItem = ({ item, isActive, onClick }) => {
  // item shape: { id, filename, date, verdict, confidence, isMultiple }
  
  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'probable_real': return 'bg-success';
      case 'probable_ai_generated': return 'bg-danger';
      case 'inconclusive': return 'bg-warning';
      default: return 'bg-muted-foreground';
    }
  };

  const formattedDate = new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: 'short'
  }).format(new Date(item.date));

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left flex flex-col p-3 rounded-lg mb-1 transition-all duration-200 group relative",
        isActive 
          ? "bg-muted" 
          : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className={cn("w-2 h-2 rounded-full flex-shrink-0", getVerdictColor(item.verdict))} />
          <span className="font-medium text-sm text-foreground truncate pr-2">
            {item.isMultiple ? "Evaluación Múltiple" : item.filename}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
          {formattedDate}
        </span>
      </div>
      <div className="flex items-center pl-4">
        <span className="text-xs text-muted-foreground truncate">
          {item.isMultiple 
            ? `${item.filesCount} imágenes analizadas`
            : `${item.confidence}% de confianza`}
        </span>
      </div>
    </button>
  );
};
