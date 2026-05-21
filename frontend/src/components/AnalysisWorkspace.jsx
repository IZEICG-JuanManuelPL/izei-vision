import React from 'react';
import { motion } from 'framer-motion';
import { VerdictCard } from './cards/VerdictCard';
import { ExplanationCard } from './cards/ExplanationCard';
import { MetadataCard } from './cards/MetadataCard';
import { VisualSignalsCard } from './cards/VisualSignalsCard';
import { RawJsonViewer } from './cards/RawJsonViewer';
import { ExtractedDataCard } from './cards/ExtractedDataCard';
import { FileText, Image as ImageIcon, Layers } from 'lucide-react';

export const AnalysisWorkspace = ({ analysis }) => {
  if (!analysis) return null;

  // Si es un análisis en conjunto (múltiples imágenes)
  if (analysis.isMultiple) {
    const globalResult = analysis.globalResult;
    const individualResults = analysis.individualResults || [];

    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
        {/* Global Summary Section */}
        <section>
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-foreground text-background rounded-lg shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Análisis de Conjunto</h1>
            </div>
            <p className="text-muted-foreground">Evaluación global de {analysis.filesCount} evidencias correlacionadas.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <VerdictCard verdict={globalResult.verdict} confidence={globalResult.confidence} />
            <ExplanationCard explanation={globalResult.explanation} />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <ExtractedDataCard data={globalResult.extractedData} />
            {globalResult.visualSignals && globalResult.visualSignals.length > 0 && (
              <VisualSignalsCard signals={globalResult.visualSignals} />
            )}
            <RawJsonViewer data={globalResult.rawResult || globalResult} />
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Desglose Individual
          </span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Individual Results Section */}
        <section className="space-y-10">
          {individualResults.map((ind, idx) => (
            <div key={idx} className="bg-muted/20 border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  {ind.filename}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Preview / Visuals */}
                <div className="lg:col-span-4 flex flex-col space-y-6">
                  {ind.previewUrl ? (
                    <div className="w-full aspect-square bg-muted/50 rounded-xl overflow-hidden border border-border flex items-center justify-center">
                       <img src={ind.previewUrl} alt={ind.filename} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-muted/50 rounded-xl border border-border flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="w-10 h-10 mb-2 opacity-30" />
                      <span className="text-xs font-medium">Sin vista previa</span>
                    </div>
                  )}
                  <VerdictCard verdict={ind.result.verdict} confidence={ind.result.confidence} />
                </div>

                {/* Details */}
                <div className="lg:col-span-8 flex flex-col space-y-6">
                  <ExplanationCard explanation={ind.result.explanation} />
                  
                  <ExtractedDataCard data={ind.result.extractedData} />
                  <MetadataCard metadata={ind.result.metadataAnalysis} />
                  
                  {ind.result.visualSignals && ind.result.visualSignals.length > 0 && (
                    <VisualSignalsCard signals={ind.result.visualSignals} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  // Si es un análisis individual
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground truncate max-w-2xl">
            {analysis.filename}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Análisis Forense completado.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Preview and Verdict */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="bg-card border border-border rounded-xl p-2 shadow-sm">
            {analysis.previewUrl ? (
              <div className="relative w-full aspect-auto max-h-[500px] bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={analysis.previewUrl} 
                  alt={analysis.filename}
                  className="w-full h-full max-h-[500px] object-contain"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center flex-col text-muted-foreground border border-border/50">
                <FileText className="w-10 h-10 mb-2 opacity-40" />
                <span className="text-sm font-medium">Sin vista previa</span>
              </div>
            )}
          </div>
          <VerdictCard verdict={analysis.verdict} confidence={analysis.confidence} />
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <ExplanationCard explanation={analysis.explanation} />
          
          <ExtractedDataCard data={analysis.extractedData} />
          
          <MetadataCard metadata={analysis.extractedData?.metadataAnalysis || analysis.rawResult?.metadataAnalysis} />
          
          <VisualSignalsCard signals={analysis.visualSignals} />
          <RawJsonViewer data={analysis.rawResult} />
        </div>
      </div>
    </div>
  );
};
