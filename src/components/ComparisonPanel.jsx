import React from 'react';
import { motion } from 'framer-motion';
import { Scaling, Check, X, Info } from 'lucide-react';

const comparisonData = [
  {
    name: "Breadth First Search (BFS)",
    structure: "Queue (FIFO)",
    time: "O(V + E)",
    space: "O(V)",
    optimal: { val: true, note: "On unweighted graphs" },
    complete: { val: true, note: "If branching factor is finite" }
  },
  {
    name: "Depth First Search (DFS)",
    structure: "Stack (LIFO)",
    time: "O(V + E)",
    space: "O(V)",
    optimal: { val: false, note: "Not guaranteed" },
    complete: { val: false, note: "Fails in infinite spaces" }
  },
  {
    name: "Uniform Cost Search (UCS)",
    structure: "Priority Queue",
    time: "O(b^(1 + C*/ε))",
    space: "O(b^(1 + C*/ε))",
    optimal: { val: true, note: "Always" },
    complete: { val: true, note: "If step costs > ε > 0" }
  },
  {
    name: "Greedy Best First Search",
    structure: "Priority Queue",
    time: "O(b^m)",
    space: "O(b^m)",
    optimal: { val: false, note: "Not guaranteed" },
    complete: { val: false, note: "Can get stuck in cycles" }
  },
  {
    name: "A* Search",
    structure: "Priority Queue",
    time: "O(b^d)",
    space: "O(b^d)",
    optimal: { val: true, note: "With admissible heuristic" },
    complete: { val: true, note: "If branching factor is finite" }
  }
];

const ComparisonPanel = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 text-white w-full">
      <header className="text-center space-y-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-4 bg-primary/10 rounded-3xl text-primary mb-2"
        >
          <Scaling size={48} strokeWidth={1.5} />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Algorithm Comparison</h2>
        <p className="text-indigo-200 text-sm md:text-base max-w-2xl mx-auto">
          A quick reference guide comparing the core properties of each search algorithm.
        </p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-indigo-950/80 border-b border-indigo-800">
                <th className="p-4 font-bold text-indigo-100 tracking-wider text-xs uppercase">Algorithm</th>
                <th className="p-4 font-bold text-indigo-100 tracking-wider text-xs uppercase">Data Structure</th>
                <th className="p-4 font-bold text-indigo-100 tracking-wider text-xs uppercase">Time Complexity</th>
                <th className="p-4 font-bold text-indigo-100 tracking-wider text-xs uppercase">Space Complexity</th>
                <th className="p-4 font-bold text-indigo-100 tracking-wider text-xs uppercase">Optimal?</th>
                <th className="p-4 font-bold text-indigo-100 tracking-wider text-xs uppercase">Complete?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-800/40">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-indigo-900/40 transition-colors">
                  <td className="p-4 font-bold text-white whitespace-nowrap">{row.name}</td>
                  <td className="p-4 text-indigo-200 text-sm font-medium">{row.structure}</td>
                  <td className="p-4 text-emerald-400 font-mono text-sm">{row.time}</td>
                  <td className="p-4 text-rose-400 font-mono text-sm">{row.space}</td>
                  <td className="p-4">
                    <StatusBadge val={row.optimal.val} text={row.optimal.note} />
                  </td>
                  <td className="p-4">
                    <StatusBadge val={row.complete.val} text={row.complete.note} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/50 flex gap-3 items-start">
        <Info className="text-indigo-400 shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-indigo-200 leading-relaxed space-y-1">
          <p><strong className="text-white">V</strong> = Number of Vertices/Nodes, <strong className="text-white">E</strong> = Number of Edges</p>
          <p><strong className="text-white">b</strong> = Branching factor, <strong className="text-white">d</strong> = Depth of the shallowest goal</p>
          <p><strong className="text-white">m</strong> = Maximum length of any path in the state space</p>
          <p><strong className="text-white">C*</strong> = Cost of the optimal solution, <strong className="text-white">ε</strong> = Minimum step cost</p>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ val, text }) => (
  <div className="flex flex-col gap-1">
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold w-fit ${
      val ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    }`}>
      {val ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
      {val ? 'YES' : 'NO'}
    </div>
    <span className="text-[10px] text-indigo-300 leading-tight">{text}</span>
  </div>
);

export default ComparisonPanel;
