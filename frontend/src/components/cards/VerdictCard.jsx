import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';

export const VerdictCard = ({ verdict, confidence }) => {
  const isReal = verdict === 'probable_real';
  const isAi = verdict === 'probable_ai_generated';
  const isInconclusive = verdict === 'inconclusive';

  let Icon = Shield;
  let title = "Inconcluso";
  let description = "No hay suficiente evidencia para determinar el origen de la imagen.";
  let colorClass = "text-warning";
  let bgClass = "bg-warning-light";

  if (isReal) {
    Icon = ShieldCheck;
    title = "Probable Imagen Real";
    description = "La imagen no presenta señales significativas de generación o manipulación sintética.";
    colorClass = "text-success";
    bgClass = "bg-success-light";
  } else if (isAi) {
    Icon = ShieldAlert;
    title = "Probable Generación IA";
    description = "Se detectaron fuertes indicios de manipulación o generación mediante inteligencia artificial.";
    colorClass = "text-danger";
    bgClass = "bg-danger-light";
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-full flex-shrink-0", bgClass, colorClass)}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className={cn("text-lg sm:text-xl font-bold tracking-tight leading-tight", colorClass)}>
              {title}
            </h2>
            <div className="mt-2 text-4xl font-black tracking-tighter text-foreground">
              {confidence}%
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-2 align-middle">
                Confianza
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2 border-t border-border/50 pt-4">
          {description}
        </p>
      </div>
    </div>
  );
};
