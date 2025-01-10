// Node.js

import { memo, useCallback, useState, useEffect, useRef } from 'react';
import NodeLayout from './NodeLayout';
import { useGraphManager } from './GraphManager';

// Helper functions to remove references
export const removePrevs = (nodes, nodeId) => {
  const nodeToRemovePrevs = nodes.find(node => node.id === nodeId);
  if (!nodeToRemovePrevs) return nodes;

  try {
    nodeToRemovePrevs.prevs.forEach(prevId => {
      const prevNode = nodes.find(node => node.id === prevId);
      if (prevNode) {
        prevNode.data.nexts = prevNode.data.nexts.filter(id => id !== nodeId);
        if (prevNode.data.true_next === nodeId) prevNode.data.true_next = null;
        if (prevNode.data.false_next === nodeId) prevNode.data.false_next = null;
      }
    });
    nodeToRemovePrevs.prevs = [];
  }
  catch (error) {
    // workaround if a node have no prevs
  }
  return nodes;
};

export const removeTrueFalse = (nodes, nodeId) => {
  const nodeToRemoveTrueFalse = nodes.find(node => node.id === nodeId);
  if (!nodeToRemoveTrueFalse) return nodes;

  const trueNextId = nodeToRemoveTrueFalse.data.true_next;
  if (trueNextId) {
    const trueNextNode = nodes.find(node => node.id === trueNextId);
    if (trueNextNode) {
      trueNextNode.prevs = trueNextNode.prevs.filter(id => id !== nodeId);
    }
  }

  const falseNextId = nodeToRemoveTrueFalse.data.false_next;
  if (falseNextId) {
    const falseNextNode = nodes.find(node => node.id === falseNextId);
    if (falseNextNode) {
      falseNextNode.prevs = falseNextNode.prevs.filter(id => id !== nodeId);
    }
  }

  nodeToRemoveTrueFalse.data.true_next = null;
  nodeToRemoveTrueFalse.data.false_next = null;
  return nodes;
};

export const removeNexts = (nodes, nodeId) => {
  const nodeToRemoveNexts = nodes.find(node => node.id === nodeId);
  if (!nodeToRemoveNexts) return nodes;

  nodeToRemoveNexts.data.nexts.forEach(nextId => {
    const nextNode = nodes.find(node => node.id === nextId);
    if (nextNode) {
      nextNode.prevs = nextNode.prevs.filter(id => id !== nodeId);
    }
  });

  nodeToRemoveNexts.data.nexts = [];
  return nodes;
};

function Node({ data, isConnectable, id, prevs }) {
  const {
      setNodes,
  } = useGraphManager();
  const [nodeData, setNodeData] = useState(data);
  const changeBuffer = useRef({});


  useEffect(() => {
    setNodeData(data);
  }, [data]);

  const handleChange = useCallback((event) => {
    const name = event.target.name;
    const value = event.target.value;
    const isComposingEvent = event.nativeEvent.isComposing;

    if (isComposingEvent) {
      changeBuffer.current = { ...changeBuffer.current, [name]: value };
    }
    else {
      updateNodeData((prevData) => ({ ...prevData, ...changeBuffer.current, [name]: value }));
      changeBuffer.current = {};
    }
  }, [id, setNodes]);

  const updateNodeData = (updateFn) => {
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: updateFn(node.data),
          };
        }
        return node;
      });
    });
  };

  const onResize = useCallback((width, height) => {
    updateNodeData((prevData) => ({ ...prevData, width, height }));
  }, [id, setNodes]);

  return (
    <NodeLayout
      data={nodeData}
      isConnectable={isConnectable}
      handleChange={handleChange}
      onResize={onResize}
      prevs={prevs}
    />
  );
}

export const addNode = (nodes, setNodes, serialNumber, setSerialNumber, newPosition) => {
  const newNode = {
    id: serialNumber.toString(),
    type: 'textUpdater',
    data: {
      name: `Node ${serialNumber}`,
      description: '',
      type: 'STEP',
      ext: { info: '' }, // Initialize ext.info for new nodes
      nexts: [],
      true_next: null,
      false_next: null,
      width: 200,
      height: 200
    },
    position: newPosition,
    prevs: []
  };
  setNodes((nodes) => nodes.concat(newNode));
  setSerialNumber(serialNumber + 1);
};

export const deleteNode = (nodes, setNodes, edges, setEdges, nodeId) => {
  let updatedNodes = [...nodes];
  const nodeToDelete = updatedNodes.find((node) => node.id === nodeId);
  if (!nodeToDelete) return;

  // Use helper functions to clean up references
  updatedNodes = removePrevs(updatedNodes, nodeId);
  updatedNodes = removeTrueFalse(updatedNodes, nodeId);
  updatedNodes = removeNexts(updatedNodes, nodeId);

  // Remove the node itself
  updatedNodes = updatedNodes.filter((node) => node.id !== nodeId);
  setNodes(updatedNodes);

  // Remove edges connected to this node
  setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
};

export default memo(Node);