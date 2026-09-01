import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGraph } from '../context/GraphContext';
import { useAlgorithm } from '../context/AlgorithmContext';
import { Maximize2, Minimize2, MousePointer2, Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const Visualizer = () => {
  const { graph, updateNodePosition, startNode, endNode } = useGraph();
  const { currentStep } = useAlgorithm();
  const [viewBox, setViewBox] = useState({ x: -80, y: -20, width: 1000, height: 800 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const lastTouchRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg') {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const { movementX, movementY } = e;
      setViewBox(prev => ({
        ...prev,
        x: prev.x - movementX / zoom,
        y: prev.y - movementY / zoom
      }));
    } else if (draggedNode) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom + viewBox.x;
      const y = (e.clientY - rect.top) / zoom + viewBox.y;
      updateNodePosition(draggedNode, x - dragOffset.x, y - dragOffset.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const handleTouchStart = (e) => {
    if (e.target.tagName === 'svg') {
      setIsDragging(true);
      if (e.touches.length > 0) {
        lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const clientX = touch.clientX;
      const clientY = touch.clientY;

      if (isDragging) {
        if (lastTouchRef.current) {
          const movementX = clientX - lastTouchRef.current.x;
          const movementY = clientY - lastTouchRef.current.y;
          setViewBox(prev => ({
            ...prev,
            x: prev.x - movementX / zoom,
            y: prev.y - movementY / zoom
          }));
        }
        lastTouchRef.current = { x: clientX, y: clientY };
      } else if (draggedNode) {
        const rect = svgRef.current.getBoundingClientRect();
        const x = (clientX - rect.left) / zoom + viewBox.x;
        const y = (clientY - rect.top) / zoom + viewBox.y;
        updateNodePosition(draggedNode, x - dragOffset.x, y - dragOffset.y);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDraggedNode(null);
    lastTouchRef.current = null;
  };

  const currentPathSet = useMemo(() => new Set(currentStep.path || []), [currentStep.path]);
  const frontierSet = useMemo(() => new Set((currentStep.frontier || []).map(f => f.id)), [currentStep.frontier]);

  return (
    <div id="visualizer-container" className="w-full h-full relative cursor-grab active:cursor-grabbing select-none overflow-hidden grid-bg">
      <div className="absolute top-0 left-0 z-10 w-full lg:w-auto">
         <div className="flex flex-row lg:flex-col p-2 lg:p-3 gap-4 lg:gap-2 bg-indigo-950/95 lg:bg-indigo-950 border-b lg:border-r lg:border-b border-indigo-700 shadow-xl rounded-none lg:rounded-br-2xl text-indigo-100 items-center lg:items-stretch overflow-x-auto">
            <div className="flex flex-row items-center gap-1 bg-indigo-900/50 p-1 rounded-lg border border-indigo-800/50 shrink-0">
              <button onClick={() => setZoom(z => Math.min(z * 1.2, 3))} className="p-1.5 hover:bg-indigo-700 hover:text-white rounded transition-colors text-indigo-300" title="Zoom In"><ZoomIn size={16} /></button>
              <button onClick={() => setZoom(z => Math.max(z / 1.2, 0.5))} className="p-1.5 hover:bg-indigo-700 hover:text-white rounded transition-colors text-indigo-300" title="Zoom Out"><ZoomOut size={16} /></button>
              <div className="w-px h-4 bg-indigo-800 mx-0.5"></div>
              <button onClick={() => { setViewBox({ x: -80, y: -20, width: 1000, height: 800 }); setZoom(1); }} className="p-1.5 hover:bg-indigo-700 hover:text-white rounded transition-colors text-indigo-300" title="Reset View"><RotateCcw size={16} /></button>
            </div>
            
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 text-[10px] font-bold px-1 shrink-0">
               <LegendItem color="bg-blue-500" label="Current" />
               <LegendItem color="bg-amber-500" label="Frontier" />
               <LegendItem color="bg-emerald-500" label="Visited" />
               <LegendItem color="bg-indigo-400" label="Path" />
            </div>
         </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width / zoom} ${viewBox.height / zoom}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-full h-full touch-none"
        style={{ cursor: isDragging ? 'grabbing' : draggedNode ? 'grabbing' : 'grab' }}
      >
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="25" refY="5" orient="auto">
            <path d="M0,0 L0,10 L10,5 Z" fill="currentColor" className="text-muted-foreground/50" />
          </marker>
        </defs>

        {/* Edges */}
        {graph.edges.map((edge, i) => {
          const fromNode = graph.nodes.get(edge.from);
          const toNode = graph.nodes.get(edge.to);
          if (!fromNode || !toNode) return null;

          const isPath = currentPathSet.has(edge.from) && currentPathSet.has(edge.to) && 
                         Math.abs(currentStep.path.indexOf(edge.from) - currentStep.path.indexOf(edge.to)) === 1;

          const isFinalPath = isPath && currentStep.type === 'success';

          return (
            <g key={i}>
              <motion.line
                initial={false}
                animate={{ x1: fromNode.x, y1: fromNode.y, x2: toNode.x, y2: toNode.y }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                stroke={isPath ? '#818cf8' : '#334155'}
                strokeWidth={isPath ? 3.5 : 1.5}
                className={`${isPath ? 'text-indigo-400' : 'text-slate-700'} ${isFinalPath ? 'path-blinking' : ''}`}
                markerEnd={graph.directed ? "url(#arrow)" : ""}
              />
              <motion.g 
                initial={false}
                animate={{ x: (fromNode.x + toNode.x) / 2, y: (fromNode.y + toNode.y) / 2 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              >
                <rect
                  x="-12"
                  y="-8"
                  width="24"
                  height="15"
                  rx="4"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1"
                  className="shadow-sm"
                />
                <text
                  dy="2.5"
                  className="text-[9px] fill-white font-mono font-bold"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              </motion.g>
            </g>
          );
        })}

        {/* Nodes */}
        {Array.from(graph.nodes.values()).map(node => {
          const isCurrent = currentStep.current === node.id;
          const isVisited = currentStep.visited.has(node.id);
          const isFrontier = frontierSet.has(node.id);
          const isStart = startNode === node.id;
          const isEnd = endNode === node.id;
          const isInPath = currentPathSet.has(node.id);

          let strokeColor = '#475569'; 
          let fillColor = '#1e293b'; 
          let textColor = 'fill-white'; 
          let strokeWidth = 1.5;
          let scale = 1;

          if (isCurrent) { 
            fillColor = '#3b82f6'; 
            strokeColor = '#93c5fd'; 
            textColor = 'fill-white font-extrabold';
            scale = 1.25; 
            strokeWidth = 2.5;
          }
          else if (isStart) { 
            strokeColor = '#10b981'; 
            fillColor = '#064e3b'; 
            textColor = 'fill-emerald-400 font-bold';
            strokeWidth = 3;
            scale = 1.05;
          }
          else if (isEnd) { 
            strokeColor = '#f43f5e'; 
            fillColor = '#881337'; 
            textColor = 'fill-rose-400 font-bold';
            strokeWidth = 3.5;
            scale = 1.1;
          }
          else if (isInPath) { 
            fillColor = '#818cf8'; 
            strokeColor = '#c7d2fe'; 
            textColor = 'fill-white font-bold';
          }
          else if (isVisited) { 
            fillColor = '#065f46'; 
            strokeColor = '#34d399'; 
            textColor = 'fill-emerald-100';
          }
          else if (isFrontier) { 
            fillColor = '#b45309'; 
            strokeColor = '#fbbf24'; 
            textColor = 'fill-amber-100';
          }

          return (
            <motion.g
              key={node.id}
              initial={false}
              animate={{ x: node.x, y: node.y, scale }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              onMouseDown={(e) => { 
                e.stopPropagation(); 
                setDraggedNode(node.id); 
                const rect = svgRef.current.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left) / zoom + viewBox.x;
                const mouseY = (e.clientY - rect.top) / zoom + viewBox.y;
                setDragOffset({ x: mouseX - node.x, y: mouseY - node.y });
              }}
              onTouchStart={(e) => { 
                e.stopPropagation(); 
                setDraggedNode(node.id); 
                const rect = svgRef.current.getBoundingClientRect();
                const touch = e.touches[0];
                const mouseX = (touch.clientX - rect.left) / zoom + viewBox.x;
                const mouseY = (touch.clientY - rect.top) / zoom + viewBox.y;
                setDragOffset({ x: mouseX - node.x, y: mouseY - node.y });
              }}
              className="cursor-pointer"
            >
              <motion.circle
                r="18"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className={`transition-colors duration-300 shadow-md ${isCurrent ? 'node-active' : ''}`}
              />
              <text
                dy=".3em"
                textAnchor="middle"
                className={`text-[9px] pointer-events-none select-none ${textColor}`}
              >
                {node.label}
              </text>
              {node.heuristic > 0 && (
                <text
                  y="28"
                  textAnchor="middle"
                  className="text-[8px] fill-white/70 font-medium"
                >
                  h: {node.heuristic}
                </text>
              )}
              {isStart && (
                  <text y="-25" textAnchor="middle" className="text-[10px] font-bold fill-emerald-500 uppercase">Start</text>
              )}
               {isEnd && (
                  <text y="-25" textAnchor="middle" className="text-[10px] font-bold fill-red-500 uppercase">Goal</text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2 shrink-0">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <span className="whitespace-nowrap">{label}</span>
  </div>
);

export default Visualizer;
