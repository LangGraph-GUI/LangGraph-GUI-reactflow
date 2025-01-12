// Edge.js

import { addEdge } from '@xyflow/react';

export const createEdge = (edges, setEdges, params, nodes, setNodes) => {
  const { source, target } = params;

  const newEdge = {
    ...params,
    id: `e${source}-${target}`,
    animated: false,
    style: { stroke: '#000000', strokeWidth: 2 },
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
    },
  };

  setEdges((eds) => addEdge(newEdge, eds));

  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === source) {
        const newData = { ...node.data, nexts: [...node.data.nexts, target] };
        return { ...node, data: newData };
      } else if (node.id === target) {
        return { ...node, prevs: [...(node.prevs || []), source] };
      }
      return node;
    })
  );

  return newEdge;
};

export const deleteEdge = (edges, setEdges, edgeId, nodes, setNodes) => {
  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return;

  setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));

  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === edge.source) {
        const newData = { ...node.data, nexts: node.data.nexts.filter((id) => id !== edge.target) };
        return { ...node, data: newData };
      } else if (node.id === edge.target) {
        return { ...node, prevs: node.prevs.filter((id) => id !== edge.source) };
      }
      return node;
    })
  );
};
