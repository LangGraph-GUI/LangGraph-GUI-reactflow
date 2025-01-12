// ConditionEdge.js

import { addEdge } from '@xyflow/react';

export const createConditionEdge = (edges, setEdges, params, nodes, setNodes) => {
  const { source, target, sourceHandle } = params;

  const newEdge = {
    ...params,
    id: `e${source}-${target}`,
    animated: false,
    style: { stroke: sourceHandle === 'true' ? 'green' : 'red', strokeWidth: 2 },
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
        const newData = {
          ...node.data,
          ...(sourceHandle === 'true' ? { true_next: target } : { false_next: target })
        };
        return { ...node, data: newData };
      } else if (node.id === target) {
        return { ...node, prevs: [...(node.prevs || []), source] };
      }
      return node;
    })
  );

  return newEdge;
};

export const deleteConditionEdge = (edges, setEdges, edgeId, nodes, setNodes) => {
  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return;

  setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));

  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === edge.source) {
        const newData = {
          ...node.data,
          ...(edge.sourceHandle === 'true'
            ? { true_next: null }
            : { false_next: null })
        };
        return { ...node, data: newData };
      } else if (node.id === edge.target) {
        return { ...node, prevs: node.prevs.filter((id) => id !== edge.source) };
      }
      return node;
    })
  );
};
