// JsonUtils.js

import NodeData from './NodeData';
import { createEdge } from './Edge';
import { createConditionEdge } from './ConditionEdge';

// Convert a single subGraph to a JSON object format
export const convertSubGraphToJson = (subGraph) => {
  const nodesData = subGraph.nodes.map((node) => {
    // Create a unique set from nexts, then convert it back to an array
    const uniqueNexts = Array.from(new Set(node.data.nexts || []));
    
    const ext = {
      pos_x: node.position.x,
      pos_y: node.position.y,
      width: node.data.width || 200,
      height: node.data.height || 200,
      info: node.data.info || '',
    };

    // Return a new node with the updated unique 'nexts' array
    const nodeData = NodeData.fromReactFlowNode({
      ...node,
      data: {
        ...node.data,
        nexts: uniqueNexts,
      },
    });

    return {
      ...nodeData.toJson(),
      ext,
    };
  });

  return {
      graphName: subGraph.graphName,
      nodes: nodesData,
      serial_number: subGraph.serial_number,
    };
};

// Convert an array of subGraphs to JSON
export const convertFlowToJson = (subGraphs) => {
    return subGraphs.map(convertSubGraphToJson)
}

// Process flow data for a single subGraph
export const convertJsonToFlow = (subGraphData) => {
  try {
    const loadedNodes = (subGraphData.nodes || []).map((nodeData) => {
      const node = NodeData.fromJson(nodeData);
      return {
        ...node.toReactFlowNode(),
        position: { x: nodeData.ext.pos_x, y: nodeData.ext.pos_y },
        data: {
          ...node.toReactFlowNode().data,
          width: nodeData.ext.width,
          height: nodeData.ext.height,
          info: nodeData.ext.info,
        },
      };
    });

    const loadedEdges = [];
    loadedNodes.forEach((node) => {
      node.data.nexts.forEach((nextId) => {
        const newEdge = createEdge(loadedEdges, null, { source: node.id, target: nextId }, loadedNodes, null);
          if (newEdge) {
            loadedEdges.push(newEdge);
          }
      });
      if (node.data.true_next) {
        const newEdge = createConditionEdge(loadedEdges, null, { source: node.id, target: node.data.true_next, sourceHandle: 'true' }, loadedNodes, null);
        if (newEdge) {
          loadedEdges.push(newEdge);
        }
      }
      if (node.data.false_next) {
        const newEdge = createConditionEdge(loadedEdges, null, { source: node.id, target: node.data.false_next, sourceHandle: 'false' }, loadedNodes, null);
        if (newEdge) {
          loadedEdges.push(newEdge);
        }
      }
    });

      return {
          nodes: loadedNodes,
          edges: loadedEdges,
          serialNumber: subGraphData.serial_number || 1,
      }
  } catch (error) {
    console.error('Error processing JSON data:', error);
    alert('Failed to process JSON data.');
    return null;
  }
};