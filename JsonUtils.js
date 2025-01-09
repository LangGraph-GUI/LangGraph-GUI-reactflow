// JsonUtils.js

import NodeData from './NodeData';
import { createEdge } from './Edge';
import { createConditionEdge } from './ConditionEdge';

// Convert nodes to a JSON object format
export const convertFlowToJson = (nodes, nodeIdCounter) => {
  const nodesData = nodes.map((node) => {
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
      ...nodeData.toDict(),
      ext,
    };
  });

  const flowData = {
    nodes: nodesData,
    node_counter: nodeIdCounter,
  };

  return flowData;
};

// Save the JSON object to a file
export const saveJsonToFile = (flowData) => {
  try {
    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow.json';
    document.body.appendChild(a); // Append the link to the body
    a.click(); // Simulate a click on the link
    document.body.removeChild(a); // Remove the link from the body
    URL.revokeObjectURL(url); // Revoke the object URL
    alert('Flow saved!');
  } catch (error) {
    console.error('Error saving JSON:', error);
    alert('Failed to save flow.');
  }
};

// Original saveJson function - keeps the original interface
export const saveJson = async (nodes, nodeIdCounter) => {
  try {
    // Convert nodes to JSON
    const flowData = convertFlowToJson(nodes, nodeIdCounter);
    // Save the JSON data to a file
    saveJsonToFile(flowData);
  } catch (error) {
    console.error('Error in saveJson:', error);
    alert('Failed to save flow.');
  }
};

// Read and process JSON file
export const readJsonFile = (event) => {
  return new Promise((resolve, reject) => {
    const file = event.target.files[0];
    if (!file) {
      reject(new Error('No file selected.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const contents = e.target.result;
        resolve(JSON.parse(contents));
      } catch (error) {
        reject(new Error('Error parsing JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file.'));
    reader.readAsText(file);
  });
};

// Process flow data
export const processFlowData = (flowData, setEdges, setNodes, setNodeIdCounter) => {
  try {
    const loadedNodes = (flowData.nodes || []).map((nodeData) => {
      const node = NodeData.fromDict(nodeData);
      // Create a new object that includes ext properties and updated width/height
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

    // First, set the nodes
    setNodes(loadedNodes);

    // Then, create edges
    const loadedEdges = [];
    loadedNodes.forEach((node) => {
      node.data.nexts.forEach((nextId) => {
        const newEdge = createEdge(loadedEdges, setEdges, { source: node.id, target: nextId }, loadedNodes, setNodes);
        if (newEdge) {
          loadedEdges.push(newEdge);
        }
      });
      if (node.data.true_next) {
        const newEdge = createConditionEdge(loadedEdges, setEdges, { source: node.id, target: node.data.true_next, sourceHandle: 'true' }, loadedNodes, setNodes);
        if (newEdge) {
          loadedEdges.push(newEdge);
        }
      }
      if (node.data.false_next) {
        const newEdge = createConditionEdge(loadedEdges, setEdges, { source: node.id, target: node.data.false_next, sourceHandle: 'false' }, loadedNodes, setNodes);
        if (newEdge) {
          loadedEdges.push(newEdge);
        }
      }
    });

    setEdges(loadedEdges);

    // Set node counter
    setNodeIdCounter(flowData.node_counter || 1);
  } catch (error) {
    console.error('Error processing JSON data:', error);
    alert('Failed to process JSON data.');
  }
};

// Load JSON file and process
export const loadJson = (setEdges, setNodes, setNodeIdCounter) => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  fileInput.addEventListener('change', async (event) => {
    try {
      const flowData = await readJsonFile(event);
      if (flowData) {
        processFlowData(flowData, setEdges, setNodes, setNodeIdCounter);
      }
    } catch (error) {
      console.error('Error loading JSON:', error);
      alert('Failed to load flow.');
    } finally {
      document.body.removeChild(fileInput); // Clean up
    }
  });

  fileInput.click();
};
