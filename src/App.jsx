import React, { useState } from 'react';
import { GraphProvider } from './context/GraphContext';
import { AlgorithmProvider } from './context/AlgorithmContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Visualizer from './components/Visualizer';
import TracePanel from './components/TracePanel';
import LearningPanel from './components/LearningPanel';
import ComparisonPanel from './components/ComparisonPanel';
import { Toaster } from 'react-hot-toast';

const GithubIcon = ({ size = 14, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 14, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('visualizer'); // visualizer, learning, comparison

  return (
    <GraphProvider>
      <AlgorithmProvider>
        <div className="min-h-[100dvh] bg-background text-foreground flex flex-col lg:overflow-hidden">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 relative flex flex-col lg:flex-row bg-indigo-900 lg:overflow-hidden">
            <Sidebar />

            <div className="flex-1 relative flex flex-col min-w-0 bg-[#0a0a0f] lg:rounded-tl-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-t lg:border-l border-indigo-800/50 lg:overflow-hidden z-10">
              {activeTab === 'visualizer' && (
                <>
                  <div className="flex-1 relative overflow-hidden min-h-[70vh] lg:min-h-0 h-auto">
                    <Visualizer />
                  </div>
                  <TracePanel />
                </>
              )}

              {activeTab === 'learning' && (
                <div className="flex-1 overflow-y-auto p-6">
                  <LearningPanel />
                </div>
              )}

              {activeTab === 'comparison' && (
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  <ComparisonPanel />
                </div>
              )}
            </div>
          </main>

          <footer className="h-10 bg-indigo-950 border-t border-indigo-900 flex items-center justify-center px-4 text-[10px] sm:text-xs text-white shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-50 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/0 via-indigo-500/10 to-indigo-900/0 opacity-50"></div>
            
            <div className="flex items-center gap-3 sm:gap-5 z-10 bg-indigo-900/40 px-6 py-1.5 rounded-full border border-indigo-800/60 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)]">
              <span className="font-medium flex items-center text-indigo-200">
                <span className="hidden sm:inline mr-1">Developed by</span> <span className="text-white font-black tracking-widest animate-name-blink">YATHEES</span>
              </span>
              
              <div className="flex items-center gap-3 sm:gap-4 border-l border-indigo-700/80 pl-3 sm:pl-4">
                <a href="https://github.com/yathees173" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-300 hover:text-white hover:scale-105 transition-all group" title="GitHub">
                  <GithubIcon size={14} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all" /> <span className="text-[10px] uppercase font-bold tracking-widest">GitHub</span>
                </a>
                <a href="https://linkedin.com/in/yathees173" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-300 hover:text-white hover:scale-105 transition-all group" title="LinkedIn">
                  <LinkedinIcon size={14} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all" /> <span className="text-[10px] uppercase font-bold tracking-widest">LinkedIn</span>
                </a>
              </div>
            </div>
          </footer>
          <Toaster position="bottom-right" />
        </div>
      </AlgorithmProvider>
    </GraphProvider>
  );
}

export default App;
