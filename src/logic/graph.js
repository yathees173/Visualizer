export class Node {
  constructor(id, x, y, label = id) {
    this.id = id;
    this.label = label;
    this.x = x;
    this.y = y;
    this.heuristic = 0;
  }
}

export class Edge {
  constructor(from, to, weight = 1, directed = false) {
    this.from = from;
    this.to = to;
    this.weight = weight;
    this.directed = directed;
  }
}

export class Graph {
  constructor() {
    this.nodes = new Map(); // id -> Node
    this.edges = [];
    this.directed = false;
  }

  addNode(id, x, y, label) {
    if (this.nodes.has(id)) return this.nodes.get(id);
    const node = new Node(id, x, y, label);
    this.nodes.set(id, node);
    return node;
  }

  addEdge(fromId, toId, weight = 1) {
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);
    if (!fromNode || !toNode) return;

    // Avoid duplicate edges in same direction
    const existing = this.edges.find(e => e.from === fromId && e.to === toId);
    if (existing) {
      existing.weight = weight;
      return;
    }

    this.edges.push(new Edge(fromId, toId, weight, this.directed));
  }

  removeEdge(fromId, toId) {
    this.edges = this.edges.filter(e => !(e.from === fromId && e.to === toId));
  }

  removeNode(id) {
    this.nodes.delete(id);
    this.edges = this.edges.filter(e => e.from !== id && e.to !== id);
  }

  setHeuristic(id, val) {
    const node = this.nodes.get(id);
    if (node) node.heuristic = val;
  }

  getNeighbors(id) {
    const neighbors = [];
    for (const edge of this.edges) {
      if (edge.from === id) {
        neighbors.push({ node: edge.to, weight: edge.weight });
      } else if (!this.directed && edge.to === id) {
        neighbors.push({ node: edge.from, weight: edge.weight });
      }
    }
    return neighbors;
  }

  serialize() {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
      directed: this.directed
    };
  }

  static deserialize(data) {
    const g = new Graph();
    g.directed = data.directed;
    data.nodes.forEach(n => {
      const node = g.addNode(n.id, n.x, n.y, n.label);
      node.heuristic = n.heuristic;
    });
    data.edges.forEach(e => g.addEdge(e.from, e.to, e.weight));
    return g;
  }
}
