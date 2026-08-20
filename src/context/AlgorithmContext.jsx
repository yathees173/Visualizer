import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useGraph } from './GraphContext';
import { searchAlgorithms } from '../logic/algorithms/search';

const AlgorithmContext = createContext();

export const AlgorithmProvider = ({ children }) => {
  const { graph, startNode, endNode } = useGraph();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('BFS');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per step
  const timerRef = useRef(null);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    const algorithmSteps = searchAlgorithms[selectedAlgorithm](graph, startNode, endNode);
    setSteps(algorithmSteps);
  }, [graph, startNode, endNode, selectedAlgorithm]);

  useEffect(() => {
    reset();
  }, [reset]);

  const stepForward = useCallback(() => {
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(prev - 1, -1));
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        stepForward();
      }, speed);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, steps.length, speed, stepForward]);

  const currentStep = steps[currentStepIndex] || {
    visited: new Set(),
    frontier: [],
    current: null,
    path: [],
    totalCost: 0,
    explanation: 'Press Start to begin.',
    dataStructure: []
  };

  return (
    <AlgorithmContext.Provider value={{
      selectedAlgorithm,
      setSelectedAlgorithm,
      steps,
      currentStepIndex,
      currentStep,
      isPlaying,
      setIsPlaying,
      speed,
      setSpeed,
      reset,
      stepForward,
      stepBackward
    }}>
      {children}
    </AlgorithmContext.Provider>
  );
};

export const useAlgorithm = () => useContext(AlgorithmContext);
