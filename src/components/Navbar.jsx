import React from 'react';
import { Network, BookOpen, Scaling, Moon, Sun, Download, Camera } from 'lucide-react';
import { useAlgorithm } from '../context/AlgorithmContext';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { isPlaying } = useAlgorithm();

  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <nav className="h-16 flex items-center justify-between px-3 md:px-6 z-50 bg-indigo-900 border-b border-indigo-800 text-white shrink-0">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="p-1.5 md:p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-900/20">
          <Network size={20} className="md:w-6 md:h-6" />
        </div>
        <div>
          <h1 className="font-bold text-base md:text-lg leading-none text-white">GraphSearch</h1>
          <p className="text-[10px] md:text-xs text-white/80">Algorithm Visualizer</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-indigo-950/50 p-1 rounded-xl border border-indigo-800">
        <NavButton 
          active={activeTab === 'visualizer'} 
          onClick={() => setActiveTab('visualizer')}
          icon={<Network size={18} />}
          label="Visualizer"
        />
        <NavButton 
          active={activeTab === 'learning'} 
          onClick={() => setActiveTab('learning')}
          icon={<BookOpen size={18} />}
          label="Learning"
        />
        <NavButton 
          active={activeTab === 'comparison'} 
          onClick={() => setActiveTab('comparison')}
          icon={<Scaling size={18} />}
          label="Comparison"
        />
      </div>

    </nav>
  );
};

const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-sm' 
        : 'text-white/80 hover:text-white hover:bg-indigo-800/50'
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

export default Navbar;
