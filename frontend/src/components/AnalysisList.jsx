import React from 'react';
import { AnalysisListItem } from './AnalysisListItem';
import { PlusCircle, Info } from 'lucide-react';

export const AnalysisList = ({ history, currentId, onSelect, onNew }) => {
  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background z-10 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">Análisis Forense</h2>
      </div>

      {/* New Analysis Button */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-start space-x-2 px-3 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors text-foreground"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nuevo Análisis</span>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {history.length === 0 ? (
          <div className="text-center mt-10 px-4">
            <Info className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">No hay análisis en esta sesión.</p>
          </div>
        ) : (
          <div className="space-y-6 mt-2">
            <div>
              <p className="px-3 text-xs font-medium text-muted-foreground mb-2">Hoy</p>
              {history.map((item) => (
                <AnalysisListItem 
                  key={item.id} 
                  item={item} 
                  isActive={currentId === item.id}
                  onClick={() => onSelect(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer / User / Settings */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent font-semibold text-xs">
            IZ
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-foreground truncate">IZEI Vision</span>
            <span className="text-xs text-muted-foreground truncate">Enterprise Edition</span>
          </div>
        </div>
      </div>
    </div>
  );
};
