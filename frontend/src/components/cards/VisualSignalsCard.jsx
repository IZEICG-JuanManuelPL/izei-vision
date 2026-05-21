import React from 'react';
import { Layers } from 'lucide-react';

export const VisualSignalsCard = ({ signals }) => {
  if (!signals || signals.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-card h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Layers className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Señales Visuales Anómalas
        </h3>
      </div>
      <ul className="space-y-2">
        {signals.map((signal, idx) => (
          <li key={idx} className="flex items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-foreground">{signal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
