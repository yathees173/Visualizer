import React, { useState } from 'react';
import {
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft, ChevronDown,
  Settings2, Plus, Trash2, Map, Layers, HelpCircle, MoreVertical, Network
} from 'lucide-react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { useGraph } from '../context/GraphContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const {
    selectedAlgorithm, setSelectedAlgorithm,
    isPlaying, setIsPlaying,
    reset, stepForward, stepBackward,
    speed, setSpeed,
    currentStepIndex, steps
  } = useAlgorithm();

  const { graph, startNode, setStartNode, endNode, setEndNode, version } = useGraph();
  const [activeSection, setActiveSection] = useState('algorithm');

  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <aside className="border-indigo-800 flex flex-col z-40 transition-all duration-300 w-full lg:w-72 border-b lg:border-b-0 lg:border-r shrink-0 bg-indigo-900 text-white">
      <div className="flex border-b border-indigo-800 shrink-0">
        <div className="flex flex-row flex-1">
          <TabButton
            active={activeSection === 'algorithm'}
            onClick={() => setActiveSection('algorithm')}
            icon={<Settings2 size={18} />}
            label="Setup"
          />
          <TabButton
            active={activeSection === 'editor'}
            onClick={() => setActiveSection('editor')}
            icon={<Network size={18} />}
            label="Graph"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-5 custom-scrollbar">
        {activeSection === 'algorithm' ? (
          <>
            <section className="space-y-3">
              <label className="text-xs font-semibold text-white uppercase tracking-wider">Select an Algorithm</label>
              <div className="relative">
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                  className="w-full bg-indigo-950/50 border border-indigo-800 shadow-sm rounded-xl p-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer text-white transition-all font-medium"
                >
                  <option className="bg-indigo-950" value="BFS">Breadth First Search (BFS)</option>
                  <option className="bg-indigo-950" value="DFS">Depth First Search (DFS)</option>
                  <option className="bg-indigo-950" value="UCS">Uniform Cost Search (UCS)</option>
                  <option className="bg-indigo-950" value="Greedy BFS">Greedy Best First Search</option>
                  <option className="bg-indigo-950" value="A*">A* Search</option>
                  <option className="bg-indigo-950" value="Dijkstra">Dijkstra's Algorithm</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-indigo-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <label className="text-xs font-semibold text-white uppercase tracking-wider">Start & End Nodes</label>
              <div className="flex flex-col gap-3">
                <div className="space-y-1 relative">
                  <span className="text-[10px] text-white px-1">Start Node</span>
                  <select
                    value={startNode || ''}
                    onChange={(e) => setStartNode(e.target.value)}
                    className="w-full bg-indigo-950/50 border border-indigo-800 shadow-sm rounded-lg p-2 pr-8 text-xs outline-none focus:border-indigo-500 text-white font-medium transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-indigo-950 text-indigo-400">Select Start Node</option>
                    {[...graph.nodes.keys()].map(id => <option className="bg-indigo-950" key={id} value={id}>{id}</option>)}
                  </select>
                  <div className="absolute bottom-2 right-2 pointer-events-none text-indigo-400">
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="space-y-1 relative">
                  <span className="text-[10px] text-white px-1">End Node</span>
                  <select
                    value={endNode || ''}
                    onChange={(e) => setEndNode(e.target.value)}
                    className="w-full bg-indigo-950/50 border border-indigo-800 shadow-sm rounded-lg p-2 pr-8 text-xs outline-none focus:border-indigo-500 text-white font-medium transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-indigo-950 text-indigo-400">Select End Node</option>
                    {[...graph.nodes.keys()].map(id => <option className="bg-indigo-950" key={id} value={id}>{id}</option>)}
                  </select>
                  <div className="absolute bottom-2 right-2 pointer-events-none text-indigo-400">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-white/30" />

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white uppercase tracking-wider">Animation Speed</label>
                <span className="text-xs font-medium text-primary">{(2000 - speed) / 100}x</span>
              </div>
              <input
                type="range" min="100" max="1900" step="100"
                value={2000 - speed}
                onChange={(e) => setSpeed(2000 - parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </section>

            <div className="pt-4 border-t border-white/30 space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs mb-1 px-1">
                  <span className="text-white font-medium">Progress</span>
                  <span className="text-indigo-400 font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-indigo-950 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <ControlButton
                  onClick={stepBackward}
                  disabled={currentStepIndex <= -1 || isPlaying}
                  icon={<ChevronLeft size={20} />}
                  label="Back"
                />
                <button
                  onClick={() => {
                    if (currentStepIndex >= steps.length - 1) {
                      reset();
                      setTimeout(() => setIsPlaying(true), 50);
                    } else {
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className={`col-span-2 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 group overflow-hidden relative border border-indigo-500/30 ${isPlaying
                    ? 'bg-amber-500 text-white shadow-amber-500/30'
                    : 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-500'
                    }`}
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="relative flex items-center gap-2">
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="animate-pulse" />}
                    <span>{isPlaying ? 'Pause' : 'Start'}</span>
                  </div>
                </button>
                <ControlButton
                  onClick={stepForward}
                  disabled={currentStepIndex >= steps.length - 1 || isPlaying}
                  icon={<ChevronRight size={20} />}
                  label="Next"
                />
              </div>

              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium border border-indigo-700/50 rounded-xl hover:bg-indigo-800/50 bg-indigo-950/30 transition-colors active:scale-95 text-indigo-200 hover:text-white"
              >
                <RotateCcw size={18} />
                Reset Simulation
              </button>
            </div>
          </>
        ) : (
          <GraphEditor />
        )}
      </div>

    </aside>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 p-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 text-white ${active
      ? 'border-indigo-400 bg-indigo-800/50'
      : 'border-transparent hover:bg-indigo-800/30'
      }`}
  >
    {icon}
    {label}
  </button>
);

const ControlButton = ({ onClick, icon, disabled, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={label}
    className={`flex items-center justify-center p-3 rounded-xl border transition-all border-indigo-700/50 ${disabled
      ? 'opacity-30 cursor-not-allowed bg-indigo-950/50 text-indigo-400'
      : 'hover:bg-indigo-700 bg-indigo-800/50 active:scale-90 shadow-sm text-white'
      }`}
  >
    {icon}
  </button>
);

import * as XLSX from 'xlsx';
import { FileUp, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const GraphEditor = () => {
  const { graph, addEdge, removeEdge, setHeuristic, loadRomaniaMap, loadComplexTree, currentGraphType } = useGraph();
  const [newEdge, setNewEdge] = useState('');
  const [newHeuristic, setNewHeuristic] = useState('');
  const [showTemplate, setShowTemplate] = useState(false);
  const [showHeuristicTemplate, setShowHeuristicTemplate] = useState(false);

  const handleHeuristicUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        let count = 0;
        data.forEach((row) => {
          if (row.length >= 2) {
            const node = String(row[0]).trim();
            const h = parseInt(row[1]) || 0;
            if (node) {
              setHeuristic(node, h);
              count++;
            }
          }
        });
        toast.success(`Imported ${count} heuristics from file!`);
      } catch (err) {
        toast.error('Error parsing file.');
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        let count = 0;
        data.forEach((row) => {
          if (row.length >= 2) {
            const from = String(row[0]).trim();
            const to = String(row[1]).trim();
            const weight = parseInt(row[2]) || 1;
            if (from && to) {
              addEdge(from, to, weight);
              count++;
            }
          }
        });
        toast.success(`Imported ${count} edges from file!`);
      } catch (err) {
        toast.error('Error parsing file.');
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white uppercase tracking-wider">Add Connection</label>
          <button
            onClick={() => setShowTemplate(!showTemplate)}
            className="text-indigo-300 hover:bg-indigo-800 p-1 rounded-md transition-colors"
            title="Show Template"
          >
            <Info size={16} />
          </button>
        </div>

        <AnimatePresence>
          {showTemplate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-indigo-950/50 border border-indigo-800 rounded-xl text-[10px] space-y-2 mb-3">
                <p className="font-bold text-indigo-300 flex items-center gap-1"><FileUp size={12} /> Excel/CSV Template</p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-indigo-800">
                      <th className="text-left py-1">Node A</th>
                      <th className="text-left py-1">Node B</th>
                      <th className="text-left py-1">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    <tr><td className="py-1">Arad</td><td className="py-1">Sibiu</td><td className="py-1">140</td></tr>
                    <tr><td className="py-1">Sibiu</td><td className="py-1">Fagaras</td><td className="py-1">99</td></tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <input
            value={newEdge}
            onChange={(e) => setNewEdge(e.target.value)}
            placeholder="A,B,5"
            className="flex-1 bg-indigo-950/50 border border-indigo-800 shadow-sm rounded-lg p-2 text-xs outline-none focus:border-indigo-400 text-white transition-all placeholder:text-indigo-400/50"
          />
          <button
            onClick={() => {
              const [f, t, w] = newEdge.split(',');
              if (f && t) addEdge(f.trim(), t.trim(), parseInt(w) || 1);
              setNewEdge('');
            }}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 shadow-md shadow-indigo-900/20"
          >
            <Plus size={18} />
          </button>

          <label className="p-2 bg-indigo-700 border border-indigo-600 text-white rounded-lg hover:bg-indigo-600 cursor-pointer shadow-md transition-all active:scale-95">
            <FileUp size={18} />
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
        <p className="text-[10px] text-white italic px-1">Format: NodeA, NodeB, Weight</p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white uppercase tracking-wider">Set Heuristic</label>
          <button
            onClick={() => setShowHeuristicTemplate(!showHeuristicTemplate)}
            className="text-indigo-300 hover:bg-indigo-800 p-1 rounded-md transition-colors"
            title="Show Template"
          >
            <Info size={16} />
          </button>
        </div>

        <AnimatePresence>
          {showHeuristicTemplate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-indigo-950/50 border border-indigo-800 rounded-xl text-[10px] space-y-2 mb-3">
                <p className="font-bold text-indigo-300 flex items-center gap-1"><FileUp size={12} /> Excel/CSV Template</p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-indigo-800">
                      <th className="text-left py-1">Node</th>
                      <th className="text-left py-1">h-value</th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    <tr><td className="py-1">Arad</td><td className="py-1">366</td></tr>
                    <tr><td className="py-1">Bucharest</td><td className="py-1">0</td></tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <input
            value={newHeuristic}
            onChange={(e) => setNewHeuristic(e.target.value)}
            placeholder="Arad, 366"
            className="flex-1 bg-indigo-950/50 border border-indigo-800 shadow-sm rounded-lg p-2 text-xs outline-none focus:border-indigo-400 text-white transition-all placeholder:text-indigo-400/50"
          />
          <button
            onClick={() => {
              const [node, h] = newHeuristic.split(',');
              if (node && h) setHeuristic(node.trim(), parseInt(h.trim()) || 0);
              setNewHeuristic('');
            }}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 shadow-md shadow-indigo-900/20"
          >
            <Plus size={18} />
          </button>

          <label className="p-2 bg-indigo-700 border border-indigo-600 text-white rounded-lg hover:bg-indigo-600 cursor-pointer shadow-md transition-all active:scale-95">
            <FileUp size={18} />
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleHeuristicUpload} className="hidden" />
          </label>
        </div>
        <p className="text-[10px] text-white italic px-1">Format: Node, Value</p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white uppercase tracking-wider">Edges</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => currentGraphType === 'tree' ? loadComplexTree() : loadRomaniaMap()}
              className="text-indigo-300 hover:text-white hover:bg-indigo-800 p-1 rounded-md transition-colors"
              title="Reset Graph to Default"
            >
              <RotateCcw size={14} />
            </button>
            <span className="text-[10px] font-bold bg-indigo-800 text-indigo-100 px-2 py-0.5 rounded-full">{graph.edges.length}</span>
          </div>
        </div>
        <div className="max-h-48 overflow-y-auto border border-indigo-800 rounded-xl divide-y divide-indigo-800/50 bg-indigo-950/30 shadow-inner custom-scrollbar">
          {graph.edges.length === 0 && (
            <div className="p-4 text-center text-xs text-white italic">No connections yet.</div>
          )}
          {graph.edges.map((edge, i) => (
            <div key={i} className="flex items-center justify-between p-3 text-xs">
              <span className="font-medium text-white">{edge.from} → {edge.to} <span className="text-indigo-300 ml-1 font-mono">({edge.weight})</span></span>
              <button onClick={() => removeEdge(edge.from, edge.to)} className="text-red-400 hover:text-red-300 hover:scale-110 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <label className="text-xs font-semibold text-white uppercase tracking-wider">Sample Graphs</label>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={loadRomaniaMap} className="flex items-center justify-center gap-2 p-2 border border-indigo-700 rounded-lg text-[10px] font-bold bg-indigo-900/50 text-indigo-100 hover:bg-indigo-700 hover:text-white transition-all shadow-md active:scale-95">
            <Map size={14} /> Romania Map
          </button>
          <button onClick={loadComplexTree} className="flex items-center justify-center gap-2 p-2 border border-indigo-700 rounded-lg text-[10px] font-bold bg-indigo-900/50 text-indigo-100 hover:bg-indigo-700 hover:text-white transition-all shadow-md active:scale-95">
            Complex Tree
          </button>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
