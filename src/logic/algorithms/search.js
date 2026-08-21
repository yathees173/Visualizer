/**
 * Each search algorithm will follow this pattern:
 * Returns an array of steps.
 * Each step contains:
 * - visited: Set of node IDs
 * - frontier: Array of objects {id, priority, parent}
 * - current: ID of node being processed
 * - path: Array of node IDs representing the current best path to 'current'
 * - totalCost: Accumulated cost
 * - explanation: Text description of what happened in this step
 * - dataStructure: State of the queue/stack/PQ
 */

export const searchAlgorithms = {
  BFS: (graph, startNode, endNode) => {
    if (!startNode || !endNode) return [{ visited: new Set(), frontier: [], current: null, path: [], totalCost: 0, explanation: 'Please select both a Start Node and a Goal Node.', dataStructure: [], type: 'failure' }];
    const steps = [];
    const queue = [{ id: startNode, path: [startNode], cost: 0 }];
    const visited = new Set();
    const frontierIds = new Set([startNode]);

    steps.push({
      visited: new Set(visited),
      frontier: [...queue],
      current: null,
      explanation: `Starting BFS from Node ${startNode}. BFS uses a FIFO Queue.`,
      dataStructure: [...queue].map(q => q.id),
      type: 'init'
    });

    while (queue.length > 0) {
      const current = queue.shift();
      frontierIds.delete(current.id);
      
      if (visited.has(current.id)) continue;
      
      visited.add(current.id);
      
      steps.push({
        visited: new Set(visited),
        frontier: [...queue],
        current: current.id,
        path: current.path,
        totalCost: current.cost,
        explanation: `Visiting Node ${current.id}. This node was pulled from the front of the queue.`,
        dataStructure: [...queue].map(q => q.id),
        type: 'visit'
      });

      if (current.id === endNode) {
        steps.push({
          visited: new Set(visited),
          frontier: [...queue],
          current: current.id,
          path: current.path,
          totalCost: current.cost,
          explanation: `Goal Node ${endNode} found!`,
          dataStructure: [...queue].map(q => q.id),
          type: 'success'
        });
        return steps;
      }

      const neighbors = graph.getNeighbors(current.id);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node) && !frontierIds.has(neighbor.node)) {
          queue.push({
            id: neighbor.node,
            path: [...current.path, neighbor.node],
            cost: current.cost + neighbor.weight
          });
          frontierIds.add(neighbor.node);
        }
      }

      steps.push({
        visited: new Set(visited),
        frontier: [...queue],
        current: current.id,
        explanation: `Expanding Node ${current.id}. Adding neighbors to the end of the queue.`,
        dataStructure: [...queue].map(q => q.id),
        type: 'expand'
      });
    }

    steps.push({ visited: new Set(visited), frontier: [], current: null, path: [], totalCost: 0, explanation: `Search exhausted. No path found to Goal Node ${endNode}.`, dataStructure: [], type: 'failure' });
    return steps;
  },

  DFS: (graph, startNode, endNode) => {
    if (!startNode || !endNode) return [{ visited: new Set(), frontier: [], current: null, path: [], totalCost: 0, explanation: 'Please select both a Start Node and a Goal Node.', dataStructure: [], type: 'failure' }];
    const steps = [];
    const stack = [{ id: startNode, path: [startNode], cost: 0 }];
    const visited = new Set();

    steps.push({
      visited: new Set(visited),
      frontier: [...stack],
      current: null,
      explanation: `Starting DFS from Node ${startNode}. DFS uses a LIFO Stack.`,
      dataStructure: [...stack].map(q => q.id),
      type: 'init'
    });

    while (stack.length > 0) {
      const current = stack.pop();
      
      if (visited.has(current.id)) continue;
      
      visited.add(current.id);
      
      steps.push({
        visited: new Set(visited),
        frontier: [...stack],
        current: current.id,
        path: current.path,
        totalCost: current.cost,
        explanation: `Visiting Node ${current.id}. This node was popped from the top of the stack.`,
        dataStructure: [...stack].map(q => q.id),
        type: 'visit'
      });

      if (current.id === endNode) {
        steps.push({
          visited: new Set(visited),
          frontier: [...stack],
          current: current.id,
          path: current.path,
          totalCost: current.cost,
          explanation: `Goal Node ${endNode} found!`,
          dataStructure: [...stack].map(q => q.id),
          type: 'success'
        });
        return steps;
      }

      const neighbors = graph.getNeighbors(current.id);
      // Reverse neighbors for stack to maintain consistent visit order if needed
      for (const neighbor of [...neighbors].reverse()) {
        if (!visited.has(neighbor.node)) {
          stack.push({
            id: neighbor.node,
            path: [...current.path, neighbor.node],
            cost: current.cost + neighbor.weight
          });
        }
      }

      steps.push({
        visited: new Set(visited),
        frontier: [...stack],
        current: current.id,
        explanation: `Expanding Node ${current.id}. Pushing unvisited neighbors onto the stack.`,
        dataStructure: [...stack].map(q => q.id),
        type: 'expand'
      });
    }

    steps.push({ visited: new Set(visited), frontier: [], current: null, path: [], totalCost: 0, explanation: `Search exhausted. No path found to Goal Node ${endNode}.`, dataStructure: [], type: 'failure' });
    return steps;
  },

  UCS: (graph, startNode, endNode) => {
    if (!startNode || !endNode) return [{ visited: new Set(), frontier: [], current: null, path: [], totalCost: 0, explanation: 'Please select both a Start Node and a Goal Node.', dataStructure: [], type: 'failure' }];
    const steps = [];
    // Simple Priority Queue implementation using sorting for educational clarity
    let pq = [{ id: startNode, path: [startNode], cost: 0 }];
    const visited = new Set();

    steps.push({
      visited: new Set(visited),
      frontier: [...pq],
      current: null,
      explanation: `Starting UCS from Node ${startNode}. UCS uses a Priority Queue ordered by path cost (g).`,
      dataStructure: [...pq].map(q => `${q.id}(g:${q.cost})`),
      type: 'init'
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a.cost - b.cost);
      const current = pq.shift();
      
      if (visited.has(current.id)) continue;
      visited.add(current.id);

      steps.push({
        visited: new Set(visited),
        frontier: [...pq],
        current: current.id,
        path: current.path,
        totalCost: current.cost,
        explanation: `Visiting Node ${current.id} with cost ${current.cost}. It has the lowest cost in the frontier.`,
        dataStructure: [...pq].map(q => `${q.id}(g:${q.cost})`),
        type: 'visit'
      });

      if (current.id === endNode) {
        steps.push({
          visited: new Set(visited),
          frontier: [...pq],
          current: current.id,
          path: current.path,
          totalCost: current.cost,
          explanation: `Goal Node ${endNode} found with optimal cost ${current.cost}!`,
          dataStructure: [...pq].map(q => `${q.id}(g:${q.cost})`),
          type: 'success'
        });
        return steps;
      }

      const neighbors = graph.getNeighbors(current.id);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          pq.push({
            id: neighbor.node,
            path: [...current.path, neighbor.node],
            cost: current.cost + neighbor.weight
          });
        }
      }

      steps.push({
        visited: new Set(visited),
        frontier: [...pq],
        current: current.id,
        explanation: `Expanding Node ${current.id}. Adding neighbors to the frontier.`,
        dataStructure: [...pq].map(q => `${q.id}(g:${q.cost})`),
        type: 'expand'
      });
    }
    steps.push({ visited: new Set(visited), frontier: [], current: null, path: [], totalCost: 0, explanation: `Search exhausted. No path found to Goal Node ${endNode}.`, dataStructure: [], type: 'failure' });
    return steps;
  },

  Dijkstra: (graph, startNode, endNode) => {
    if (!startNode || !endNode) return [{ visited: new Set(), frontier: [], current: null, path: [], totalCost: 0, explanation: 'Please select both a Start Node and a Goal Node.', dataStructure: [], type: 'failure' }];
    const steps = [];
    let pq = [{ id: startNode, path: [startNode], cost: 0 }];
    const visited = new Set();

    steps.push({
      visited: new Set(visited),
      frontier: [...pq],
      current: null,
      explanation: `Starting Dijkstra from Node ${startNode}. It uses a Priority Queue to find the shortest path.`,
      dataStructure: [...pq].map(q => `${q.id}(cost:${q.cost})`),
      type: 'init'
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a.cost - b.cost);
      const current = pq.shift();
      
      if (visited.has(current.id)) continue;
      visited.add(current.id);

      steps.push({
        visited: new Set(visited),
        frontier: [...pq],
        current: current.id,
        path: current.path,
        totalCost: current.cost,
        explanation: `Visiting Node ${current.id} with cost ${current.cost}. It has the lowest cost in the queue.`,
        dataStructure: [...pq].map(q => `${q.id}(cost:${q.cost})`),
        type: 'visit'
      });

      if (current.id === endNode) {
        steps.push({
          visited: new Set(visited),
          frontier: [...pq],
          current: current.id,
          path: current.path,
          totalCost: current.cost,
          explanation: `Goal Node ${endNode} found with optimal cost ${current.cost}!`,
          dataStructure: [...pq].map(q => `${q.id}(cost:${q.cost})`),
          type: 'success'
        });
        return steps;
      }

      const neighbors = graph.getNeighbors(current.id);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          pq.push({
            id: neighbor.node,
            path: [...current.path, neighbor.node],
            cost: current.cost + neighbor.weight
          });
        }
      }

      steps.push({
        visited: new Set(visited),
        frontier: [...pq],
        current: current.id,
        explanation: `Expanding Node ${current.id}. Adding unvisited neighbors to the Priority Queue.`,
        dataStructure: [...pq].map(q => `${q.id}(cost:${q.cost})`),
        type: 'expand'
      });
    }
    steps.push({ visited: new Set(visited), frontier: [], current: null, path: [], totalCost: 0, explanation: `Search exhausted. No path found to Goal Node ${endNode}.`, dataStructure: [], type: 'failure' });
    return steps;
  },

  'A*': (graph, startNode, endNode) => {
    if (!startNode || !endNode) return [{ visited: new Set(), frontier: [], current: null, path: [], totalCost: 0, explanation: 'Please select both a Start Node and a Goal Node.', dataStructure: [], type: 'failure' }];
    const steps = [];
    const getH = (id) => graph.nodes.get(id)?.heuristic || 0;
    let pq = [{ id: startNode, path: [startNode], g: 0, f: getH(startNode) }];
    const visited = new Set();

    steps.push({
      visited: new Set(visited),
      frontier: [...pq],
      current: null,
      explanation: `Starting A* from Node ${startNode}. A* uses f(n) = g(n) + h(n).`,
      dataStructure: [...pq].map(q => `${q.id}(f:${q.f.toFixed(1)})`),
      type: 'init'
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a.f - b.f);
      const current = pq.shift();
      
      if (visited.has(current.id)) continue;
      visited.add(current.id);

      steps.push({
        visited: new Set(visited),
        frontier: [...pq],
        current: current.id,
        path: current.path,
        totalCost: current.g,
        explanation: `Visiting Node ${current.id} with f=${current.f.toFixed(1)} (g=${current.g}, h=${getH(current.id)}).`,
        dataStructure: [...pq].map(q => `${q.id}(f:${q.f.toFixed(1)})`),
        type: 'visit'
      });

      if (current.id === endNode) {
        steps.push({
          visited: new Set(visited),
          frontier: [...pq],
          current: current.id,
          path: current.path,
          totalCost: current.g,
          explanation: `Goal Node ${endNode} found! Total path cost: ${current.g}.`,
          dataStructure: [...pq].map(q => `${q.id}(f:${q.f.toFixed(1)})`),
          type: 'success'
        });
        return steps;
      }

      const neighbors = graph.getNeighbors(current.id);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          const g = current.g + neighbor.weight;
          const h = getH(neighbor.node);
          pq.push({
            id: neighbor.node,
            path: [...current.path, neighbor.node],
            g: g,
            f: g + h
          });
        }
      }

      steps.push({
        visited: new Set(visited),
        frontier: [...pq],
        current: current.id,
        explanation: `Expanding Node ${current.id}. Calculating f = g + h for all neighbors.`,
        dataStructure: [...pq].map(q => `${q.id}(f:${q.f.toFixed(1)})`),
        type: 'expand'
      });
    }
    steps.push({ visited: new Set(visited), frontier: [], current: null, path: [], totalCost: 0, explanation: `Search exhausted. No path found to Goal Node ${endNode}.`, dataStructure: [], type: 'failure' });
    return steps;
  },

  'Greedy BFS': (graph, startNode, endNode) => {
    if (!startNode || !endNode) return [{ visited: new Set(), frontier: [], current: null, path: [], totalCost: 0, explanation: 'Please select both a Start Node and a Goal Node.', dataStructure: [], type: 'failure' }];
    const steps = [];
    const getH = (id) => graph.nodes.get(id)?.heuristic || 0;
    let pq = [{ id: startNode, path: [startNode], h: getH(startNode), cost: 0 }];
    const visited = new Set();

    steps.push({
      visited: new Set(visited),
      frontier: [...pq],
      current: null,
      explanation: `Starting Greedy BFS. It only considers the heuristic h(n).`,
      dataStructure: [...pq].map(q => `${q.id}(h:${q.h})`),
      type: 'init'
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a.h - b.h);
      const current = pq.shift();
      
      if (visited.has(current.id)) continue;
      visited.add(current.id);

      steps.push({
        visited: new Set(visited),
        frontier: [...pq],
        current: current.id,
        path: current.path,
        totalCost: current.cost,
        explanation: `Visiting Node ${current.id} because it has the lowest heuristic h=${current.h}.`,
        dataStructure: [...pq].map(q => `${q.id}(h:${q.h})`),
        type: 'visit'
      });

      if (current.id === endNode) {
        steps.push({
          visited: new Set(visited),
          frontier: [...pq],
          current: current.id,
          path: current.path,
          totalCost: current.cost,
          explanation: `Goal Node ${endNode} found!`,
          dataStructure: [...pq].map(q => `${q.id}(h:${q.h})`),
          type: 'success'
        });
        return steps;
      }

      const neighbors = graph.getNeighbors(current.id);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          pq.push({
            id: neighbor.node,
            path: [...current.path, neighbor.node],
            h: getH(neighbor.node),
            cost: current.cost + neighbor.weight
          });
        }
      }

      steps.push({
        visited: new Set(visited),
        frontier: [...pq],
        current: current.id,
        explanation: `Expanding Node ${current.id}. Adding neighbors to frontier based on heuristic.`,
        dataStructure: [...pq].map(q => `${q.id}(h:${q.h})`),
        type: 'expand'
      });
    }
    steps.push({ visited: new Set(visited), frontier: [], current: null, path: [], totalCost: 0, explanation: `Search exhausted. No path found to Goal Node ${endNode}.`, dataStructure: [], type: 'failure' });
    return steps;
  }
};
