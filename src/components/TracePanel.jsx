import React, { useState } from 'react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, List, History, CheckCircle2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

const TracePanel = () => {
  const { currentStep, currentStepIndex, steps, selectedAlgorithm } = useAlgorithm();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const generatePDFReport = async () => {
    setIsGeneratingReport(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let y = margin + 10;

      // Header Title
      doc.setFontSize(26);
      doc.setTextColor(49, 46, 129); // indigo-900
      doc.text('Search Execution Report', margin, y);
      y += 15;

      // Metadata Section
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(`Algorithm Used:`, margin, y);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(67, 56, 202); // indigo-600
      doc.text(selectedAlgorithm, margin + 35, y);
      doc.setFont(undefined, 'normal');
      
      y += 8;
      doc.setTextColor(71, 85, 105);
      doc.text(`Status:`, margin, y);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text(`Goal Node Found`, margin + 35, y);
      doc.setFont(undefined, 'normal');

      y += 8;
      doc.setTextColor(71, 85, 105);
      doc.text(`Total Path Cost:`, margin, y);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(`${currentStep.totalCost || 0}`, margin + 35, y);
      doc.setFont(undefined, 'normal');

      y += 8;
      doc.setTextColor(71, 85, 105);
      doc.text(`Total Steps:`, margin, y);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${steps.length}`, margin + 35, y);
      doc.setFont(undefined, 'normal');
      
      y += 18;

      // Highlighted Final Path Box
      doc.setFillColor(238, 242, 255); // indigo-50
      doc.setDrawColor(199, 210, 254); // indigo-200
      
      const pathText = currentStep.path ? currentStep.path.join('  ➔  ') : 'None';
      doc.setFontSize(13);
      const pathLines = doc.splitTextToSize(pathText, pageWidth - margin * 2 - 14);
      const boxHeight = 25 + (pathLines.length - 1) * 7;
      
      doc.roundedRect(margin, y, pageWidth - (margin * 2), boxHeight, 3, 3, 'FD');
      
      y += 9;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(99, 102, 241); // indigo-500
      doc.text('FINAL RESOLVED PATH', margin + 7, y);
      
      y += 8;
      doc.setFontSize(13);
      doc.setTextColor(30, 58, 138); // indigo-900
      doc.text(pathLines, margin + 7, y);
      
      y += (pathLines.length * 7) + 18; // move past the box

      // Step by step analysis Title
      doc.setFontSize(18);
      doc.setTextColor(49, 46, 129); // indigo-900
      doc.text('Step-by-Step Analysis', margin, y);
      y += 12;

      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepPrefix = `${i + 1}. `;
        const stepText = step.explanation;
        
        doc.setTextColor(50, 50, 50);
        if (step.type === 'success') doc.setTextColor(0, 150, 0);
        else if (step.type === 'visit') doc.setTextColor(0, 0, 150);
        else if (step.type === 'init') doc.setTextColor(100, 0, 150);

        const lines = doc.splitTextToSize(stepPrefix + stepText, pageWidth - margin * 2);
        
        if (y + (lines.length * 5) > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        
        doc.text(lines, margin, y);
        y += (lines.length * 5) + 3;
      }

      doc.save('search_execution_report.pdf');

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF report: ${error.message || error}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="h-auto lg:h-72 border-t glass flex flex-col lg:flex-row shadow-lg z-30 bg-white/40 shrink-0">
      {/* Explanation Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-100 lg:overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Info size={20} />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800">Step Analysis</h3>
          </div>
          
          {currentStep.type === 'success' && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex text-[10px] font-bold text-slate-700 bg-white/50 px-2 py-1 rounded border border-slate-200 shadow-sm max-w-[200px] lg:max-w-[400px]">
                <span className="text-slate-500 mr-1">PATH:</span>
                <span className="text-indigo-600 font-mono truncate">{currentStep.path?.join(' ➔ ')}</span>
              </div>
              <button 
                onClick={generatePDFReport}
                disabled={isGeneratingReport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded text-[11px] font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isGeneratingReport ? <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Download size={14} />}
                {isGeneratingReport ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <p className="text-base font-medium leading-relaxed text-slate-700">
              {currentStep.explanation}
            </p>
            
            <div className="flex flex-wrap gap-4">
               <StatItem label="Current Node" value={<span className="stat-number">{currentStep.current || '-'}</span>} />
               <StatItem label="Visit Order" value={<span className="stat-number">{currentStepIndex + 1}</span>} />
               <StatItem label="Path Cost" value={<span className="stat-number">{currentStep.totalCost || 0}</span>} />
               {currentStep.type === 'success' && (
                 <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100/80 text-emerald-700 rounded-full text-xs font-bold animate-bounce shadow-sm border border-emerald-250">
                   <CheckCircle2 size={14} /> GOAL REACHED
                 </div>
               )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Data Structure Area */}
      <div className="w-full lg:w-96 p-4 lg:p-6 flex flex-col gap-4 bg-slate-50/50 border-l border-slate-100 lg:overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <List size={20} />
            <h3 className="font-bold text-sm uppercase tracking-wider">Frontier State</h3>
          </div>
          <span className="text-[10px] bg-background px-2 py-0.5 rounded-md border font-mono">
            {currentStep.dataStructure?.length || 0} items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
           <div className="flex flex-wrap gap-2">
             {currentStep.dataStructure?.length === 0 && (
                <div className="w-full text-center py-8 text-xs text-muted-foreground">Empty</div>
             )}
             <AnimatePresence>
               {currentStep.dataStructure?.map((item, i) => (
                 <motion.div
                   key={`${item}-${i}`}
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0, opacity: 0 }}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm flex items-center gap-2 ${
                     i === 0 ? 'bg-primary text-white border-primary' : 'bg-background glass'
                   }`}
                 >
                   {i === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                   {item}
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] text-muted-foreground uppercase font-bold">{label}</span>
    <span className="text-sm font-mono font-bold text-foreground/80">{value}</span>
  </div>
);

export default TracePanel;
