import React, { useState } from 'react';
import { Code2, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export const RawJsonViewer = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            RAW JSON Output
          </h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="relative border-t border-border">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-background border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
            title="Copy JSON"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
          <div className="p-4 bg-muted overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
            <pre className="text-xs font-mono text-foreground leading-relaxed">
              <code>{jsonString}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
