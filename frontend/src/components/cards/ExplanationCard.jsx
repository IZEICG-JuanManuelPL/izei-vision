import React from 'react';
import { AlignLeft } from 'lucide-react';

export const ExplanationCard = ({ explanation }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-card h-full">
      <div className="flex items-center space-x-2 mb-4">
        <AlignLeft className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Análisis Forense
        </h3>
      </div>
      <div className="prose prose-sm prose-slate max-w-none text-foreground leading-relaxed">
        <p>{explanation}</p>
      </div>
    </div>
  );
};
