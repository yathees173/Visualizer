import React from 'react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { motion } from 'framer-motion';
import { Brain, Clock, Zap, Target, AlertTriangle, Book } from 'lucide-react';

const algorithmInfo = {
  BFS: {
    title: "Breadth First Search",
    complexity: { time: "O(V + E)", space: "O(V)" },
    dataStructure: "Queue (FIFO)",
    logic: "Explores all neighbor nodes at the present depth prior to moving on to nodes at the next depth level.",
    advantages: ["Guarantees shortest path on unweighted graphs", "Complete algorithm"],
    disadvantages: ["High memory usage as it stores all nodes at current level"],
    useCases: ["Social networking sites", "Shortest path in unweighted graphs", "GPS navigation"]
  },
  DFS: {
    title: "Depth First Search",
    complexity: { time: "O(V + E)", space: "O(V)" },
    dataStructure: "Stack (LIFO)",
    logic: "Explores as far as possible along each branch before backtracking.",
    advantages: ["Low memory usage", "Efficient for finding any path"],
    disadvantages: ["Not guaranteed to find shortest path", "Can get stuck in infinite loops (if not visited-checked)"],
    useCases: ["Solving puzzles with only one solution", "Topological sorting", "Maze generation"]
  },
  UCS: {
    title: "Uniform Cost Search",
    complexity: { time: "O(b^(1 + C*/ε))", space: "O(b^(1 + C*/ε))" },
    dataStructure: "Priority Queue",
    logic: "Expands the leaf node with the lowest path cost from the start node.",
    advantages: ["Guarantees optimal path based on weights", "Complete if edge costs > 0"],
    disadvantages: ["Explores in all directions equally", "Can be slow on large graphs"],
    useCases: ["GPS routing", "Lowest cost pathfinding in weighted graphs"]
  },
  'A*': {
    title: "A* Search",
    complexity: { time: "O(b^d)", space: "O(b^d)" },
    dataStructure: "Priority Queue",
    logic: "Selects path that minimizes f(n) = g(n) + h(n), where g is path cost and h is estimated cost to goal.",
    advantages: ["Highly efficient with good heuristic", "Optimal and Complete"],
    disadvantages: ["Heuristic must be admissible (never overestimates) for optimality"],
    useCases: ["Video games pathfinding", "Robotics navigation", "Traffic routing"]
  },
  'Greedy BFS': {
    title: "Greedy Best First Search",
    complexity: { time: "O(b^m)", space: "O(b^m)" },
    dataStructure: "Priority Queue",
    logic: "Expands node that is estimated to be closest to goal based only on heuristic h(n).",
    advantages: ["Often very fast in finding a goal"],
    disadvantages: ["Not optimal", "Can get stuck in cycles if not visited-checked"],
    useCases: ["Fast search where optimality isn't critical"]
  }
};

const LearningPanel = () => {
  const { selectedAlgorithm } = useAlgorithm();
  const info = algorithmInfo[selectedAlgorithm] || algorithmInfo.BFS;

  return (
    <div className="max-w-4xl mx-auto space-y-12 text-white">
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-4 bg-primary/10 rounded-3xl text-primary mb-2"
        >
          <Brain size={48} strokeWidth={1.5} />
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight text-white">{info.title}</h2>
        <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
          {info.logic}
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <InfoCard 
          title="Complexity" 
          icon={<Clock className="text-amber-500" />}
          items={[
            { label: "Time Complexity", value: info.complexity.time },
            { label: "Space Complexity", value: info.complexity.space },
            { label: "Data Structure", value: info.dataStructure }
          ]}
        />
        
        <InfoCard 
          title="Practical Usage" 
          icon={<Target className="text-indigo-500" />}
          list={info.useCases}
        />

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-6 border-l-4 border-l-emerald-500"
        >
           <h4 className="flex items-center gap-2 font-bold mb-4 text-emerald-600">
             <Zap size={20} /> Pros
           </h4>
           <ul className="space-y-3">
             {info.advantages.map((adv, i) => (
                <li key={i} className="flex gap-3 text-sm text-indigo-100">
                  <span className="text-emerald-500 font-bold">•</span>
                  {adv}
                </li>
             ))}
           </ul>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-6 border-l-4 border-l-red-500"
        >
           <h4 className="flex items-center gap-2 font-bold mb-4 text-red-600">
             <AlertTriangle size={20} /> Cons
           </h4>
           <ul className="space-y-3">
             {info.disadvantages.map((dis, i) => (
                <li key={i} className="flex gap-3 text-sm text-indigo-100">
                  <span className="text-red-500 font-bold">•</span>
                  {dis}
                </li>
             ))}
           </ul>
        </motion.div>
      </div>

      <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-colors">
            <Book size={120} />
         </div>
         <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
           <Brain size={24} className="text-primary" /> Did you know?
         </h3>
         <p className="text-indigo-200 leading-relaxed relative z-10">
           The core difference between these algorithms is the way they prioritize nodes in the frontier. 
           BFS uses a simple <strong className="text-white">queue</strong> to explore level-by-level, while DFS uses a <strong className="text-white">stack</strong>. 
           Informed searches like <strong className="text-white">A*</strong> use extra knowledge (heuristics) to guide the search towards the goal more efficiently.
         </p>
      </div>
    </div>
  );
};

const InfoCard = ({ title, icon, items, list }) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className="glass-card p-6 text-white"
  >
    <div className="flex items-center gap-2 mb-6 border-b border-indigo-800/50 pb-4">
      {icon}
      <h4 className="font-bold text-sm uppercase tracking-widest text-indigo-100">{title}</h4>
    </div>
    
    {items && (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-indigo-950/50 p-3 rounded-xl border border-indigo-800/50">
            <span className="text-xs text-indigo-300 font-medium">{item.label}</span>
            <span className="text-sm font-mono font-bold text-indigo-100">{item.value}</span>
          </div>
        ))}
      </div>
    )}

    {list && (
      <ul className="space-y-3">
        {list.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm bg-indigo-950/30 p-2 rounded-lg text-indigo-100">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
             {item}
          </li>
        ))}
      </ul>
    )}
  </motion.div>
);

export default LearningPanel;
