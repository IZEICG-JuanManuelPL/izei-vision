import React from 'react';
import { Database, LayoutGrid } from 'lucide-react';

export const ExtractedDataCard = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-card h-full">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Datos Estructurados
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {Object.entries(data).map(([key, value], idx) => {
          // Format key to look nicer (e.g. "firstName" -> "First Name")
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
            
          let displayValue = value;
          
          if (Array.isArray(value)) {
            displayValue = (
              <div className="flex flex-wrap gap-1 mt-1">
                {value.map((v, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground border border-border/50">
                    {v}
                  </span>
                ))}
              </div>
            );
          } else if (typeof value === 'object' && value !== null) {
             displayValue = (
              <pre className="text-xs bg-muted/50 p-2 rounded-md mt-1 overflow-x-auto border border-border/50">
                {JSON.stringify(value, null, 2)}
              </pre>
             );
          } else {
             displayValue = (
               <span className="text-sm font-medium text-foreground block mt-0.5">{value?.toString() || '—'}</span>
             );
          }

          return (
            <div key={idx} className="flex flex-col border-b border-border/50 pb-2 last:border-0 sm:last:border-b sm:even:border-b-0">
              <span className="text-xs font-medium text-muted-foreground">{formattedKey}</span>
              {displayValue}
            </div>
          );
        })}
      </div>
    </div>
  );
};
