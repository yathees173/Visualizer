import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Graph } from '../logic/graph';

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const [graph, setGraph] = useState(new Graph());
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [version, setVersion] = useState(0); // Trigger re-renders

  const [currentGraphType, setCurrentGraphType] = useState('romania');

  const loadRomaniaMap = useCallback(() => {
    setCurrentGraphType('romania');
    const g = new Graph();
    g.addNode('Arad', 50, 150);
    g.addNode('Zerind', 80, 60);
    g.addNode('Oradea', 150, 30);
    g.addNode('Sibiu', 200, 180);
    g.addNode('Timisoara', 50, 280);
    g.addNode('Lugoj', 150, 350);
    g.addNode('Mehadia', 150, 420);
    g.addNode('Drobeta', 150, 490);
    g.addNode('Craiova', 280, 490);
    g.addNode('Rimnicu Vilcea', 250, 280);
    g.addNode('Fagaras', 350, 180);
    g.addNode('Pitesti', 400, 350);
    g.addNode('Bucharest', 550, 420);
    g.addNode('Giurgiu', 530, 520);
    g.addNode('Urziceni', 630, 350);
    g.addNode('Vaslui', 730, 250);
    g.addNode('Iasi', 700, 150);
    g.addNode('Neamt', 600, 100);
    g.addNode('Hirsova', 730, 420);
    g.addNode('Eforie', 780, 500);

    g.addEdge('Arad', 'Zerind', 75);
    g.addEdge('Arad', 'Sibiu', 140);
    g.addEdge('Arad', 'Timisoara', 118);
    g.addEdge('Zerind', 'Oradea', 71);
    g.addEdge('Oradea', 'Sibiu', 151);
    g.addEdge('Timisoara', 'Lugoj', 111);
    g.addEdge('Lugoj', 'Mehadia', 70);
    g.addEdge('Mehadia', 'Drobeta', 75);
    g.addEdge('Drobeta', 'Craiova', 120);
    g.addEdge('Sibiu', 'Rimnicu Vilcea', 80);
    g.addEdge('Sibiu', 'Fagaras', 99);
    g.addEdge('Rimnicu Vilcea', 'Pitesti', 97);
    g.addEdge('Rimnicu Vilcea', 'Craiova', 146);
    g.addEdge('Fagaras', 'Bucharest', 211);
    g.addEdge('Pitesti', 'Bucharest', 101);
    g.addEdge('Pitesti', 'Craiova', 138);
    g.addEdge('Bucharest', 'Giurgiu', 90);
    g.addEdge('Bucharest', 'Urziceni', 85);
    g.addEdge('Urziceni', 'Vaslui', 142);
    g.addEdge('Urziceni', 'Hirsova', 98);
    g.addEdge('Hirsova', 'Eforie', 86);
    g.addEdge('Vaslui', 'Iasi', 92);
    g.addEdge('Iasi', 'Neamt', 87);

    const hDist = {
      'Arad': 366, 'Bucharest': 0, 'Craiova': 160, 'Drobeta': 242, 'Eforie': 161,
      'Fagaras': 176, 'Giurgiu': 77, 'Hirsova': 151, 'Iasi': 226, 'Lugoj': 244,
      'Mehadia': 241, 'Neamt': 234, 'Oradea': 380, 'Pitesti': 100, 'Rimnicu Vilcea': 193,
      'Sibiu': 253, 'Timisoara': 329, 'Urziceni': 80, 'Vaslui': 199, 'Zerind': 374
    };
    Object.keys(hDist).forEach(k => g.setHeuristic(k, hDist[k]));

    setGraph(g);
    setStartNode('Arad');
    setEndNode('Bucharest');
    setVersion(v => v + 1);
  }, []);

  const loadComplexTree = useCallback(() => {
    setCurrentGraphType('tree');
    const g = new Graph();
    // Level 0 (Root)
    g.addNode('A', 400, 50);
    
    // Level 1 (3 children)
    g.addNode('B', 200, 150);
    g.addNode('C', 400, 150);
    g.addNode('D', 600, 150);
    
    // Level 2
    // B's children (2)
    g.addNode('E', 100, 250);
    g.addNode('F', 250, 250);
    // C's children (4)
    g.addNode('G', 350, 250);
    g.addNode('H', 450, 250);
    g.addNode('I', 550, 250);
    g.addNode('J', 650, 250);
    // D's child (1)
    g.addNode('K', 750, 250);
    
    // Level 3
    // H's children (3)
    g.addNode('L', 350, 350);
    g.addNode('M', 450, 350);
    g.addNode('N', 550, 350); // Goal
    
    // Edges with varied costs
    g.addEdge('A', 'B', 3);
    g.addEdge('A', 'C', 5);
    g.addEdge('A', 'D', 4);
    g.addEdge('B', 'E', 2);
    g.addEdge('B', 'F', 4);
    g.addEdge('C', 'G', 6);
    g.addEdge('C', 'H', 3);
    g.addEdge('C', 'I', 7);
    g.addEdge('C', 'J', 5);
    g.addEdge('D', 'K', 8);
    g.addEdge('H', 'L', 4);
    g.addEdge('H', 'M', 5);
    g.addEdge('H', 'N', 2);

    // Heuristics (Goal is 'N')
    const hDist = {
      'N': 0, 'M': 2, 'L': 4,
      'K': 7, 'J': 6, 'I': 4, 'H': 4, 'G': 6, 'F': 8, 'E': 10,
      'D': 8, 'C': 6, 'B': 8, 'A': 9
    };
    Object.keys(hDist).forEach(k => g.setHeuristic(k, hDist[k]));

    setGraph(g);
    setStartNode('A');
    setEndNode('N');
    setVersion(v => v + 1);
  }, []);

  useEffect(() => {
    loadRomaniaMap();
  }, [loadRomaniaMap]);

  const addEdge = useCallback((from, to, weight) => {
    graph.addEdge(from, to, weight);
    setVersion(v => v + 1);
  }, [graph]);

  const removeEdge = useCallback((from, to) => {
    graph.removeEdge(from, to);
    
    // Auto-delete nodes that have no edges left
    const hasEdges = (nodeId) => graph.edges.some(e => e.from === nodeId || e.to === nodeId);
    
    let startReset = false;
    let endReset = false;
    
    if (!hasEdges(from)) {
      graph.removeNode(from);
      if (startNode === from) startReset = true;
      if (endNode === from) endReset = true;
    }
    if (from !== to && !hasEdges(to)) {
      graph.removeNode(to);
      if (startNode === to) startReset = true;
      if (endNode === to) endReset = true;
    }
    
    if (startReset) setStartNode(null);
    if (endReset) setEndNode(null);

    setVersion(v => v + 1);
  }, [graph, startNode, endNode]);

  const addNode = useCallback((id, x, y) => {
    graph.addNode(id, x, y);
    setVersion(v => v + 1);
  }, [graph]);

  const updateNodePosition = useCallback((id, x, y) => {
    const node = graph.nodes.get(id);
    if (node) {
      node.x = x;
      node.y = y;
      setVersion(v => v + 1);
    }
  }, [graph]);

  const setHeuristic = useCallback((id, val) => {
    graph.setHeuristic(id, val);
    setVersion(v => v + 1);
  }, [graph]);

  return (
    <GraphContext.Provider value={{ 
      graph, 
      startNode, 
      setStartNode, 
      endNode, 
      setEndNode, 
      addEdge, 
      removeEdge, 
      addNode,
      updateNodePosition,
      setHeuristic,
      loadRomaniaMap,
      loadComplexTree,
      currentGraphType,
      version 
    }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => useContext(GraphContext);
